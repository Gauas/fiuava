import { chromium } from "playwright";
import fs from "node:fs";

const inputUrl = process.argv[2];
const requestedWidth = Number(process.argv[3] || 0);

if (!inputUrl) {
  console.error(`
Thiếu URL.

Ví dụ:
  node capture.mjs http://localhost:5173/introduce/
  node capture.mjs http://localhost:5173/introduce/ 414
  `);

  process.exit(1);
}

let url;

try {
  url = new URL(inputUrl).toString();
} catch {
  console.error(`URL không hợp lệ: ${inputUrl}`);
  process.exit(1);
}

const parsedUrl = new URL(url);

const pageName =
    parsedUrl.pathname
        .replace(/^\/|\/$/g, "")
        .replaceAll("/", "-")
        .replace(/[^a-zA-Z0-9-_]/g, "") || "home";

const defaultViewports = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 414, height: 896 },
];

const viewports = requestedWidth
    ? [
      {
        width: requestedWidth,
        height:
            requestedWidth <= 480
                ? 896
                : requestedWidth <= 800
                    ? 1024
                    : 900,
      },
    ]
    : defaultViewports;

fs.mkdirSync("screenshots", {
  recursive: true,
});

/**
 * Ép các tài nguyên lazy-load phổ biến tải ngay.
 */
async function forceLazyResources(page) {
  await page.evaluate(() => {
    function getFirstAttribute(element, attributes) {
      for (const attribute of attributes) {
        const value = element.getAttribute(attribute);

        if (value) {
          return value;
        }
      }

      return null;
    }

    document.querySelectorAll("img").forEach((image) => {
      image.loading = "eager";
      image.decoding = "sync";

      const lazySrc = getFirstAttribute(image, [
        "data-src",
        "data-lazy-src",
        "data-original",
        "data-image",
      ]);

      const lazySrcset = getFirstAttribute(image, [
        "data-srcset",
        "data-lazy-srcset",
      ]);

      if (lazySrc) {
        image.src = lazySrc;
      }

      if (lazySrcset) {
        image.srcset = lazySrcset;
      }
    });

    document.querySelectorAll("picture source").forEach((source) => {
      const lazySrcset =
          source.getAttribute("data-srcset") ||
          source.getAttribute("data-lazy-srcset");

      if (lazySrcset) {
        source.srcset = lazySrcset;
      }
    });

    document.querySelectorAll("iframe").forEach((iframe) => {
      iframe.loading = "eager";

      const lazySrc =
          iframe.getAttribute("data-src") ||
          iframe.getAttribute("data-lazy-src");

      if (lazySrc) {
        iframe.src = lazySrc;
      }
    });

    document.querySelectorAll("video").forEach((video) => {
      video.preload = "auto";

      const lazyPoster = video.getAttribute("data-poster");

      if (lazyPoster) {
        video.poster = lazyPoster;
      }

      video.querySelectorAll("source").forEach((source) => {
        const lazySrc = source.getAttribute("data-src");

        if (lazySrc) {
          source.src = lazySrc;
        }
      });

      video.load();
    });

    document
        .querySelectorAll(
            "[data-bg], [data-background], [data-background-image]"
        )
        .forEach((element) => {
          const background =
              element.getAttribute("data-bg") ||
              element.getAttribute("data-background") ||
              element.getAttribute("data-background-image");

          if (background) {
            element.style.backgroundImage =
                `url(${JSON.stringify(background)})`;
          }
        });
  });
}

/**
 * Cuộn toàn bộ trang và cả những container cuộn riêng.
 * Tiếp tục lặp nếu chiều cao trang thay đổi do nội dung lazy-load.
 */
async function scrollThroughAllContent(page) {
  await page.evaluate(async () => {
    const sleep = (milliseconds) =>
        new Promise((resolve) => {
          setTimeout(resolve, milliseconds);
        });

    const waitForFrames = () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });

    const hydrateNewLazyElements = () => {
      document.querySelectorAll("img").forEach((image) => {
        image.loading = "eager";

        const lazySrc =
            image.getAttribute("data-src") ||
            image.getAttribute("data-lazy-src") ||
            image.getAttribute("data-original");

        const lazySrcset =
            image.getAttribute("data-srcset") ||
            image.getAttribute("data-lazy-srcset");

        if (lazySrc) {
          image.src = lazySrc;
        }

        if (lazySrcset) {
          image.srcset = lazySrcset;
        }
      });

      document.querySelectorAll("picture source").forEach((source) => {
        const lazySrcset =
            source.getAttribute("data-srcset") ||
            source.getAttribute("data-lazy-srcset");

        if (lazySrcset) {
          source.srcset = lazySrcset;
        }
      });

      document.querySelectorAll("iframe").forEach((iframe) => {
        iframe.loading = "eager";

        const lazySrc =
            iframe.getAttribute("data-src") ||
            iframe.getAttribute("data-lazy-src");

        if (lazySrc) {
          iframe.src = lazySrc;
        }
      });
    };

    const scrollingElement =
        document.scrollingElement || document.documentElement;

    const scrollElement = async (element, isDocument = false) => {
      const viewportHeight = isDocument
          ? window.innerHeight
          : element.clientHeight;

      const step = Math.max(
          300,
          Math.floor(viewportHeight * 0.7)
      );

      const getMaximumScroll = () =>
          isDocument
              ? scrollingElement.scrollHeight - window.innerHeight
              : element.scrollHeight - element.clientHeight;

      let maximumScroll = getMaximumScroll();

      for (
          let position = 0;
          position <= maximumScroll;
          position += step
      ) {
        if (isDocument) {
          window.scrollTo({
            top: position,
            behavior: "instant",
          });
        } else {
          element.scrollTop = position;
        }

        hydrateNewLazyElements();

        await waitForFrames();
        await sleep(80);

        maximumScroll = getMaximumScroll();
      }

      if (isDocument) {
        window.scrollTo({
          top: scrollingElement.scrollHeight,
          behavior: "instant",
        });
      } else {
        element.scrollTop = element.scrollHeight;
      }

      hydrateNewLazyElements();

      await waitForFrames();
      await sleep(250);
    };

    let previousHeight = 0;
    let stableRounds = 0;

    // Giới hạn để tránh vòng lặp vô hạn với infinite scroll.
    for (let round = 0; round < 6; round += 1) {
      hydrateNewLazyElements();

      await scrollElement(scrollingElement, true);

      // Tìm các container cuộn dọc riêng.
      const scrollContainers = Array.from(
          document.querySelectorAll("body *")
      ).filter((element) => {
        const style = getComputedStyle(element);

        const canScroll =
            style.overflowY === "auto" ||
            style.overflowY === "scroll";

        const hasHiddenContent =
            element.scrollHeight > element.clientHeight + 150;

        const isLargeEnough =
            element.clientWidth > window.innerWidth * 0.5 &&
            element.clientHeight > 200;

        const ignoredElement =
            element instanceof HTMLTextAreaElement ||
            element.tagName === "PRE" ||
            element.closest("nav");

        return (
            canScroll &&
            hasHiddenContent &&
            isLargeEnough &&
            !ignoredElement
        );
      });

      for (const container of scrollContainers) {
        await scrollElement(container, false);
      }

      const currentHeight = scrollingElement.scrollHeight;

      if (Math.abs(currentHeight - previousHeight) <= 2) {
        stableRounds += 1;
      } else {
        stableRounds = 0;
      }

      previousHeight = currentHeight;

      if (stableRounds >= 2) {
        break;
      }

      await sleep(400);
    }

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    await sleep(300);
  });
}

/**
 * Chờ ảnh, font và số tài nguyên tải về ổn định.
 * Không dùng networkidle vì Vite HMR có thể giữ kết nối liên tục.
 */
async function waitForAssets(page, timeout = 15_000) {
  const startTime = Date.now();

  let previousState = "";
  let stableCount = 0;

  while (Date.now() - startTime < timeout) {
    const state = await page.evaluate(() => {
      const images = Array.from(document.images);

      const pendingImages = images.filter((image) => {
        const hasSource = Boolean(
            image.currentSrc ||
            image.src ||
            image.getAttribute("data-src")
        );

        return hasSource && !image.complete;
      }).length;

      return {
        pendingImages,
        resourceCount:
        performance.getEntriesByType("resource").length,
        scrollHeight:
            document.scrollingElement?.scrollHeight ||
            document.documentElement.scrollHeight,
      };
    });

    const serializedState = JSON.stringify(state);

    if (
        serializedState === previousState &&
        state.pendingImages === 0
    ) {
      stableCount += 1;
    } else {
      stableCount = 0;
    }

    if (stableCount >= 4) {
      break;
    }

    previousState = serializedState;

    await page.waitForTimeout(250);
  }

  // Decode các ảnh đã tải trước khi chụp.
  await page.evaluate(async () => {
    const images = Array.from(document.images);

    await Promise.allSettled(
        images.map(async (image) => {
          if (!image.complete) {
            await new Promise((resolve) => {
              image.addEventListener("load", resolve, {
                once: true,
              });

              image.addEventListener("error", resolve, {
                once: true,
              });
            });
          }

          if (
              typeof image.decode === "function" &&
              image.naturalWidth > 0
          ) {
            await image.decode().catch(() => {});
          }
        })
    );
  });
}

/**
 * Mở rộng các container chính có overflow riêng.
 * Giúp fullPage lấy được footer và toàn bộ chiều cao.
 */
async function expandMainScrollContainers(page) {
  await page.evaluate(() => {
    const candidates = [
      document.documentElement,
      document.body,
      document.querySelector("#root"),
      document.querySelector("#app"),
      document.querySelector("main"),
      document.querySelector("[data-scroll-container]"),
    ].filter(Boolean);

    document.querySelectorAll("body *").forEach((element) => {
      const style = getComputedStyle(element);

      const isVerticalScrollContainer =
          (style.overflowY === "auto" ||
              style.overflowY === "scroll") &&
          element.scrollHeight > element.clientHeight + 500 &&
          element.clientWidth > window.innerWidth * 0.7;

      if (isVerticalScrollContainer) {
        candidates.push(element);
      }
    });

    [...new Set(candidates)].forEach((element) => {
      element.style.setProperty(
          "height",
          "auto",
          "important"
      );

      element.style.setProperty(
          "max-height",
          "none",
          "important"
      );

      element.style.setProperty(
          "overflow-y",
          "visible",
          "important"
      );
    });

    document.documentElement.style.setProperty(
        "overflow-y",
        "visible",
        "important"
    );

    document.body.style.setProperty(
        "overflow-y",
        "visible",
        "important"
    );
  });
}

const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport,
      deviceScaleFactor: 1,
    });

    page.setDefaultTimeout(15_000);

    console.log(
        `\nĐang chụp ${pageName} ở ${viewport.width}px...`
    );

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    // Chờ font.
    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });

    await forceLazyResources(page);

    console.log("Đang cuộn để tải lazy content...");

    await scrollThroughAllContent(page);

    console.log("Đang chờ ảnh và tài nguyên...");

    await waitForAssets(page);

    // Xử lý trường hợp trang cuộn trong main/#root.
    await expandMainScrollContainers(page);

    // Chiều cao thay đổi sau khi mở rộng container,
    // vì vậy cuộn và kiểm tra thêm một lần.
    await forceLazyResources(page);
    await scrollThroughAllContent(page);
    await waitForAssets(page, 8_000);

    // Chỉ tắt animation sau khi đã cuộn qua tất cả section.
    await page.addStyleTag({
      content: `
        html,
        body {
          scroll-behavior: auto !important;
        }

        *,
        *::before,
        *::after {
          animation-delay: 0s !important;
          animation-duration: 0s !important;
          transition-delay: 0s !important;
          transition-duration: 0s !important;
          caret-color: transparent !important;
        }

        * {
          content-visibility: visible !important;
        }
      `,
    });

    await page.evaluate(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    });

    await page.waitForTimeout(300);

    const outputPath =
        `screenshots/${pageName}-${viewport.width}.png`;

    await page.screenshot({
      path: outputPath,
      fullPage: true,
      animations: "disabled",
    });

    console.log(`Đã tạo: ${outputPath}`);

    await page.close();
  }
} catch (error) {
  console.error("\nChụp màn hình thất bại:");
  console.error(error);

  process.exitCode = 1;
} finally {
  await browser.close();
}
