import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-500.css';
import '@fontsource/be-vietnam-pro/vietnamese-600.css';
import '@fontsource/be-vietnam-pro/vietnamese-700.css';
import '@fontsource/fraunces/vietnamese-600.css';
import '@fontsource/fraunces/vietnamese-700.css';
import './styles.css';
import { getGoogleSheetsConfig, submitToGoogleSheets } from './google-sheets.js';

document.documentElement.classList.add('js');

const page = document.body.dataset.page || 'home';
const app = document.querySelector('#app');
const root = page === 'home' ? './' : '../';
const routes = {
  home: root,
  introduce: `${root}introduce/`,
  about: `${root}about/`,
  survey: `${root}survey/`,
  contact: `${root}contact/`,
};
const asset = (name) => `${root}${name}`;

const navItems = [
  ['about', 'Câu chuyện', routes.about],
  ['introduce', 'Sản phẩm', routes.introduce],
  ['experience', 'Trải nghiệm', `${routes.home}#experience`],
  ['project', 'Dự án', `${routes.home}#project`],
  ['survey', 'Khảo sát', routes.survey],
  ['contact', 'Liên hệ', routes.contact],
];

const icon = (name) => {
  const paths = {
    leaf: '<path d="M20 4C11 4 5 9 5 17c7 1 13-3 15-13Z"/><path d="M5 20c3-6 7-9 12-12"/>',
    candy: '<path d="m7 9-4-3v12l4-3M17 9l4-3v12l-4-3"/><rect x="7" y="7" width="10" height="10" rx="3"/>',
    heart: '<path d="M20.8 5.9a5.5 5.5 0 0 0-7.8 0L12 7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z"/>',
    recycle: '<path d="m9 4 3-2 3 2M12 2v6M5 10l-3 2 1 4M2 12l5 3M19 10l3 2-1 4M22 12l-5 3M7 21h10M7 21l-2-3M17 21l2-3"/>',
    bag: '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .4 1.9.6 2.9.7a2 2 0 0 1 1.6 1.9Z"/>',
    pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-9V3"/><path d="M8 15h8"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
    package: '<path d="m16.5 9.4-9-5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="M3.3 7 12 12l8.7-5M12 22V12"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24">${paths[name]}</svg>`;
};

const header = () => `
  <header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="${routes.home}" aria-label="Fiuava — Trang chủ">
        <img src="${asset('logo.png')}" width="499" height="446" alt="Fiuava" />
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
        <span>Menu</span><i aria-hidden="true"></i>
      </button>
      <nav class="primary-nav" id="primary-nav" aria-label="Điều hướng chính">
        ${navItems.map(([id, label, href]) => `<a href="${href}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
        <a class="nav-cta" href="${routes.introduce}">${icon('bag')} Khám phá ngay</a>
      </nav>
    </div>
  </header>`;

const contactItems = `
  <a href="tel:+84364531571">${icon('phone')}<span><small>Điện thoại / Zalo</small>0364 531 571</span></a>
  <a href="mailto:lienhe@fiuava.website">${icon('mail')}<span><small>Email</small>lienhe@fiuava.website</span></a>
  <a href="https://fiuava.website/" target="_blank" rel="noreferrer">${icon('globe')}<span><small>Website</small>fiuava.website</span></a>
  <a href="https://maps.google.com/?q=140+Lê+Trọng+Tấn,+phường+Tây+Thạnh,+TP.+Hồ+Chí+Minh" target="_blank" rel="noreferrer">${icon('pin')}<span><small>Địa chỉ</small>140 Lê Trọng Tấn, phường Tây Thạnh, TP. Hồ Chí Minh</span></a>`;

const footer = () => `
  ${page === 'home' || page === 'contact' ? '' : `<section class="closing-cta">
    <div class="shell closing-inner">
      <div><h2>Nhẹ bụng mỗi ngày cùng Fiuava</h2><p>Một viên kẹo nhỏ, thêm một lựa chọn dễ chịu cho hệ tiêu hóa.</p></div>
      <a class="button button--light" href="${routes.contact}">${icon('bag')} Liên hệ ngay</a>
    </div>
  </section>`}
  <footer class="site-footer">
    <div class="shell footer-grid">
      <section class="footer-brand">
        <img src="${asset('logo.png')}" width="499" height="446" alt="Fiuava" />
        <p>Kẹo dinh dưỡng tiện lợi từ nguồn chất xơ tự nhiên thu nhận từ phụ phẩm bã ổi.</p>
      </section>
      <section><h2>Khám phá</h2><ul>${navItems.slice(0, 4).map(([, label, href]) => `<li><a href="${href}">${label}</a></li>`).join('')}</ul></section>
      <section><h2>Liên hệ</h2><div class="footer-contact">${contactItems}</div></section>
    </div>
    <div class="shell footer-bottom"><span>© <span data-year></span> Fiuava.</span><span>Kẹo dinh dưỡng từ chất xơ bã ổi.</span></div>
  </footer>`;

const imagePlaceholder = (label, className = '') => `
  <figure class="media-placeholder ${className}" role="img" aria-label="${label}">
    <span aria-hidden="true">+</span><figcaption>${label}</figcaption>
  </figure>`;

const homePage = () => `
  <main id="main-content" class="brand-home">
    <section class="morning-hero" aria-labelledby="home-title">
      <div class="morning-hero__scene">
        <figure class="morning-hero__visual"><img src="${asset('editorial/home-hero-artwork.jpg')}" width="2170" height="725" fetchpriority="high" decoding="async" alt="Gói kẹo ổi hồng Fiuava giữa hoa, lá và quả ổi hồng"></figure>
        <div class="morning-hero__copy">
          <p class="eyebrow">Kẹo ổi hồng Fiuava</p>
          <h1 id="home-title">Nhẹ nhàng bắt đầu<br>từ một điều <span>rất nhỏ.</span></h1>
          <p>Một viên kẹo ổi hồng thơm dịu, tiện mang theo và được phát triển từ nguồn chất xơ tự nhiên.</p>
          <div class="button-row"><a class="button button--primary" href="${routes.introduce}">Khám phá Fiuava</a><a class="button button--outline" href="#open-fiuava"><span aria-hidden="true">▶</span> Xem viên kẹo bên trong</a></div>
        </div>
      </div>
    </section>

    <section class="life-moments" id="experience" aria-labelledby="moments-title"><div class="shell">
      <header class="home-heading home-heading--inline"><span aria-hidden="true">${icon('clock')}</span><h2 id="moments-title">Có những ngày…</h2></header>
      <div class="moment-grid">
        <article class="moment-card moment-card--one"><img src="${asset('lifestyle/morning-desk.webp')}" width="960" height="640" loading="eager" decoding="async" alt="Một buổi sáng bận rộn bên bàn làm việc"><p>Có những ngày bạn ăn vội hơn bình thường.</p></article>
        <article class="moment-card moment-card--two"><img src="${asset('lifestyle/hurried-meal.webp')}" width="960" height="640" loading="eager" decoding="async" alt="Một bữa ăn vội thiếu rau xanh"><p>Có những ngày rau xanh bị bỏ quên.</p></article>
        <article class="moment-card moment-card--three"><img src="${asset('lifestyle/everyday-bag.webp')}" width="960" height="640" loading="eager" decoding="async" alt="Túi xách và những vật dụng nhỏ mang theo hằng ngày"><p>Có những lúc bạn chỉ muốn một món nhỏ, dễ ăn và dễ mang theo.</p></article>
        <article class="moment-card moment-card--answer"><img src="${asset('logo.png')}" width="499" height="446" loading="lazy" decoding="async" alt="Fiuava"><p>Fiuava được tạo ra cho những khoảnh khắc như thế.</p></article>
      </div>
    </div></section>

    <section class="open-fiuava shell" id="open-fiuava" aria-labelledby="open-title">
      <figure class="open-fiuava__visual"><img src="${asset('product.png')}" width="617" height="587" loading="lazy" decoding="async" alt="Bao bì và viên kẹo Fiuava trong khung cảnh ổi hồng"></figure>
      <div class="open-fiuava__copy"><header class="home-heading"><span aria-hidden="true">${icon('candy')}</span><h2 id="open-title">Mở một viên Fiuava</h2></header><ol class="open-layers">${[
        ['package','Lớp 1 — Mở gói','Mỗi viên được đóng gói riêng, sạch sẽ và thuận tiện mang theo.'],
        ['heart','Lớp 2 — Cảm nhận','Hương ổi hồng dịu nhẹ, kết cấu mềm và dễ sử dụng mỗi ngày.'],
        ['leaf','Lớp 3 — Giá trị bên trong','Được phát triển từ nguồn chất xơ thu nhận từ bã ổi.']
      ].map(([name,title,copy])=>`<li><span>${icon(name)}</span><div><h3>${title}</h3><p>${copy}</p></div></li>`).join('')}</ol><a class="button button--primary" href="${routes.introduce}">Khám phá sản phẩm</a></div>
    </section>

    <section class="candy-inside shell" aria-labelledby="inside-title"><div class="candy-inside__panel">
      <header class="home-heading home-heading--center"><h2 id="inside-title">Một viên nhỏ có gì?</h2></header>
      <div class="candy-orbit"><figure class="candy-orbit__center"><img src="${asset('editorial/individual-candy-wrapper.jpg')}" width="1313" height="1198" loading="eager" decoding="async" alt="Một viên kẹo ổi hồng Fiuava được gói riêng"></figure><article><span>${icon('leaf')}</span><h3>Nguyên liệu</h3><p>Chất xơ có nguồn gốc từ phụ phẩm bã ổi.</p></article><article><span>${icon('heart')}</span><h3>Trải nghiệm</h3><p>Hương vị gần gũi, kích thước nhỏ và dễ sử dụng.</p></article><article><span>${icon('package')}</span><h3>Tiện lợi</h3><p>Gói riêng từng viên, phù hợp cho nhiều thời điểm trong ngày.</p></article></div>
      <p class="product-disclaimer">Fiuava là sản phẩm thực phẩm, không phải thuốc và không có tác dụng thay thế thuốc chữa bệnh.</p>
    </div></section>

    <section class="guava-journey shell" aria-labelledby="journey-title"><header class="guava-journey__intro"><p class="eyebrow">Hành trình của phần quả thường bị bỏ lại</p><h2 id="journey-title">Không phải phần còn lại nào cũng là thứ nên bỏ đi.</h2></header><ol class="journey-track">${[
      ['01','Quả ổi được sử dụng','Phần thịt và nước ổi trở thành thực phẩm, đồ uống.','journey/pink-guava.webp','Quả ổi hồng tươi'],
      ['02','Phần bã còn lại','Bã ổi vẫn chứa nguồn chất xơ có thể tiếp tục được khai thác.','journey/guava-pomace.webp','Phần bã ổi sau khi ép'],
      ['03','Nghiên cứu và xử lý','Nguồn nguyên liệu được lựa chọn, xử lý và đưa vào quá trình phát triển công thức.','journey/food-research.webp','Không gian nghiên cứu nguyên liệu thực phẩm'],
      ['04','Trở thành Fiuava','Từ phần nguyên liệu dễ bị bỏ quên đến một viên kẹo nhỏ, tiện lợi hơn trong cuộc sống.','product-cutout.png','Gói Fiuava và viên kẹo gói riêng']
    ].map(([n,title,copy,src,alt])=>`<li><b>${n}</b><figure><img src="${asset(src)}" width="960" height="640" loading="eager" decoding="async" alt="${alt}"></figure><h3>${title}</h3><p>${copy}</p></li>`).join('')}</ol></section>

    <section class="when-section" aria-labelledby="when-title"><div class="shell"><header class="home-heading home-heading--inline"><span aria-hidden="true">${icon('clock')}</span><h2 id="when-title">Fiuava đi cùng bạn khi nào?</h2></header><div class="when-grid">${[
      ['Sau một bữa ăn vội','Một lựa chọn nhỏ, dễ mang theo trong ngày bận rộn.','lifestyle/after-meal.webp'],
      ['Trong giờ nghỉ giữa ngày','Hương ổi nhẹ nhàng cho một khoảng nghỉ ngắn.','interest-lifestyle.jpg'],
      ['Trên đường đi học hoặc đi làm','Mỗi viên gói riêng, thuận tiện để trong túi.','lifestyle/commute.webp'],
      ['Khi cả nhà muốn chia sẻ','Một gói kẹo có thể trở thành khoảnh khắc vui vẻ chung.','lifestyle/family-sharing.webp']
    ].map(([title,copy,src])=>`<article><figure><img src="${asset(src)}" width="960" height="640" loading="eager" decoding="async" alt="${title}"></figure><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div></div></section>

    <section class="project-origin shell" id="project" aria-labelledby="project-title"><figure class="project-origin__artwork"><img src="${asset('editorial/project-origin-artwork.jpg')}" width="1916" height="821" loading="lazy" decoding="async" alt="Hành trình Fiuava từ việc nhìn thấy vấn đề, nghiên cứu nguyên liệu, phát triển công thức đến lắng nghe người dùng"></figure><div class="project-origin__mobile-content"><div class="project-origin__intro"><img src="${asset('logo.png')}" width="499" height="446" loading="lazy" decoding="async" alt="Fiuava"><h2 id="project-title">Fiuava không bắt đầu từ một viên kẹo.</h2><p>Sản phẩm bắt đầu từ một câu hỏi: liệu phần bã ổi có thể tiếp tục tạo ra giá trị?</p><a class="text-link" href="${routes.about}">Khám phá dự án Fiuava <span>→</span></a></div><ol class="project-steps">${[
      ['search','Nhìn thấy vấn đề','Phụ phẩm bã ổi chưa được tận dụng hiệu quả.'],
      ['flask','Nghiên cứu nguyên liệu','Tìm hiểu đặc tính và khả năng ứng dụng của chất xơ.'],
      ['candy','Phát triển công thức','Điều chỉnh hương vị, kết cấu và trải nghiệm sử dụng.'],
      ['users','Lắng nghe người dùng','Khảo sát cảm quan và tiếp tục hoàn thiện sản phẩm.']
    ].map(([name,title,copy],i)=>`<li><b>${String(i+1).padStart(2,'0')}</b><span>${icon(name)}</span><h3>${title}</h3><p>${copy}</p></li>`).join('')}</ol></div><div class="project-origin__desktop-action"><a class="button button--outline" href="${routes.about}">Khám phá dự án Fiuava</a></div></section>

    <section class="quality-desk shell" aria-labelledby="quality-home-title"><div class="quality-desk__visual"><img src="${asset('product.png')}" width="617" height="587" loading="lazy" decoding="async" alt="Sản phẩm Fiuava trên bàn kiểm tra chất lượng"><span>${icon('search')}</span></div><div class="quality-desk__copy"><header class="home-heading"><h2 id="quality-home-title">Điều chúng tôi kiểm tra trước khi sản phẩm đến tay bạn</h2></header><div class="quality-checks">${[
      ['leaf','Nguyên liệu','Nguồn nguyên liệu và quy trình xử lý được theo dõi rõ ràng.'],
      ['shield','Chất lượng sản phẩm','Các chỉ tiêu phù hợp được đánh giá trong quá trình phát triển.'],
      ['package','Thông tin minh bạch','Thành phần và hướng dẫn sử dụng được trình bày rõ trên bao bì.']
    ].map(([name,title,copy])=>`<article><span>${icon(name)}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div><button class="button button--outline" type="button" disabled aria-describedby="quality-doc-note">Tài liệu đang cập nhật</button><p id="quality-doc-note" class="quality-doc-note">Tài liệu kiểm nghiệm chỉ được hiển thị khi có bản chính thức.</p></div></section>

    <section class="trial-diary shell" id="feedback" aria-labelledby="diary-title"><div><header class="home-heading home-heading--center"><p class="eyebrow">Phản hồi từ đợt dùng thử</p><h2 id="diary-title">Nhật ký dùng thử Fiuava</h2></header><ol class="diary-line">${[
      ['lifestyle/everyday-bag.webp','Ngày đầu tiên','“Mình ấn tượng vì từng viên được gói riêng và dễ mang theo.”'],
      ['lifestyle/after-meal.webp','Sau vài lần sử dụng','“Hương ổi nhẹ, không tạo cảm giác quá gắt.”'],
      ['lifestyle/morning-desk.webp','Điều người dùng muốn thay đổi','“Mình muốn có thêm lựa chọn về độ ngọt và kích thước gói.”']
    ].map(([src,title,quote])=>`<li><figure><img src="${asset(src)}" width="960" height="640" loading="eager" decoding="async" alt="Hình ảnh minh họa cho phản hồi ẩn danh"></figure><div><small>Phản hồi ẩn danh</small><h3>${title}</h3><blockquote>${quote}</blockquote></div></li>`).join('')}</ol><div class="diary-action"><a class="button button--outline" href="${routes.survey}">Xem cảm nhận khách hàng</a></div></div></section>

    <section class="rhythm-section shell" aria-labelledby="rhythm-title"><div class="rhythm-panel"><header><p class="eyebrow">Khám phá nhịp sống của bạn</p><h2 id="rhythm-title">Fiuava nào hợp với nhịp sống của bạn?</h2><p>Chọn nhanh ba câu để nhận một gợi ý nhẹ nhàng — không phải chẩn đoán sức khỏe.</p></header><form class="rhythm-quiz"><fieldset><legend>Bạn thường ăn nhẹ vào thời điểm nào?</legend><div><label><input type="radio" name="time" value="midday"><span>Giữa buổi</span></label><label><input type="radio" name="time" value="meal"><span>Sau bữa ăn</span></label><label><input type="radio" name="time" value="travel"><span>Trên đường</span></label></div></fieldset><fieldset><legend>Điều bạn quan tâm hơn?</legend><div><label><input type="radio" name="priority" value="taste"><span>Hương vị</span></label><label><input type="radio" name="priority" value="convenience"><span>Sự tiện lợi</span></label><label><input type="radio" name="priority" value="ingredient"><span>Thành phần</span></label></div></fieldset><fieldset><legend>Bạn thường mang sản phẩm theo ở đâu?</legend><div><label><input type="radio" name="place" value="bag"><span>Túi xách</span></label><label><input type="radio" name="place" value="desk"><span>Bàn làm việc</span></label><label><input type="radio" name="place" value="backpack"><span>Balo</span></label></div></fieldset><output class="rhythm-result" hidden aria-live="polite"><strong>Bạn thuộc nhóm “Nhẹ nhàng giữa ngày”</strong><span>Một viên kẹo gói riêng có thể phù hợp với những khoảng nghỉ ngắn của bạn.</span></output><a class="button button--primary" href="${routes.survey}">Làm khảo sát đầy đủ</a></form></div></section>

    <section class="home-final"><div class="shell home-final__inner"><figure><img src="${asset('product-cutout.png')}" width="512" height="487" loading="lazy" decoding="async" alt="Fiuava và các viên kẹo ổi hồng"></figure><div><h2>Cùng Fiuava hoàn thiện viên kẹo tiếp theo.</h2><p>Một sản phẩm tốt hơn được tạo nên từ những phản hồi thật. Hãy chia sẻ cảm nhận về hương vị, kết cấu, bao bì và trải nghiệm của bạn.</p><div class="button-row"><a class="button button--light" href="${routes.survey}">Chia sẻ cảm nhận</a><a class="button button--outline" href="${routes.about}">Tìm hiểu về Fiuava</a></div></div></div></section>
  </main>`;

const pageHero = (eyebrow, title, copy, product = false) => `<section class="page-hero"><div class="shell page-hero-grid"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${copy}</p></div>${product ? `<figure><img src="${asset('product.png')}" width="617" height="587" alt="Sản phẩm Fiuava" /></figure>` : ''}</div></section>`;

const introducePage = () => `<main id="main-content" class="product-page">
  <section class="product-showcase">
    <div class="shell product-showcase__grid">
      <div class="product-showcase__copy">
        <p class="eyebrow">Hồ sơ sản phẩm Fiuava</p>
        <h1>Kẹo ổi hồng từ nguồn xơ bã ổi.</h1>
        <p>Fiuava đưa phần chất xơ còn lại trong bã ổi vào một định dạng kẹo nhỏ gọn, có hương ổi chua ngọt và từng viên được gói riêng để thuận tiện mang theo.</p>
        <div class="button-row"><a class="button button--primary" href="#product-specs">Xem thông số <b aria-hidden="true">↓</b></a><a class="button button--outline" href="#production-process">Xem quy trình</a></div>
        <ul class="product-showcase__facts"><li><span>Dạng sản phẩm</span><strong>Kẹo ổi hồng</strong></li><li><span>Nguồn xơ</span><strong>Phụ phẩm bã ổi</strong></li><li><span>Quy cách</span><strong>Gói riêng từng viên</strong></li></ul>
      </div>
      <figure class="product-showcase__visual"><span aria-hidden="true"></span><img src="${asset('product-cutout.png')}" width="512" height="487" alt="Túi kẹo ổi hồng Fiuava cùng các viên kẹo gói riêng"><figcaption>Thiết kế bao bì hiện tại của Fiuava</figcaption></figure>
    </div>
  </section>

  <section class="product-overview shell" id="product-specs" aria-labelledby="product-specs-title">
    <header class="product-section-heading"><div><p class="eyebrow">Thông số hiện tại</p><h2 id="product-specs-title">Một hồ sơ sản phẩm rõ ràng, không lẫn với câu chuyện thương hiệu.</h2></div><p>Các thông tin dưới đây mô tả định hướng công thức và bao gói hiện tại. Chỉ tiêu định lượng sẽ được cập nhật sau khi hoàn tất kiểm nghiệm.</p></header>
    <div class="product-overview__layout">
      <div class="product-overview__statement"><span aria-hidden="true">F</span><h3>Nhỏ gọn bên ngoài, có chủ đích bên trong.</h3><p>Sản phẩm tập trung vào ba phần: nguồn xơ từ bã ổi, trải nghiệm cảm quan dễ tiếp cận và quy cách bao gói thuận tiện cho sử dụng hằng ngày.</p></div>
      <dl class="product-spec-ledger">${[
        ['Dòng sản phẩm','Kẹo dinh dưỡng hương ổi'],
        ['Nguồn nguyên liệu','Phụ phẩm bã ổi sau quá trình ép'],
        ['Thành phần trọng tâm','Pectin và phần xơ hòa tan từ bã ổi'],
        ['Hương vị','Ổi chua ngọt, hướng đến độ thơm dễ chịu'],
        ['Kết cấu','Dai mềm, hướng đến hạn chế bết dính'],
        ['Bao gói','Túi zip lớn, mỗi viên được gói riêng'],
        ['Trạng thái','Công thức đang tiếp tục được hoàn thiện'],
        ['Chỉ tiêu định lượng','Cập nhật sau kiểm nghiệm']
      ].map(([term,description])=>`<div><dt>${term}</dt><dd>${description}</dd></div>`).join('')}</dl>
    </div>
  </section>

  <section class="product-anatomy" aria-labelledby="product-anatomy-title"><div class="shell">
    <header class="product-section-heading product-section-heading--compact"><div><p class="eyebrow">Cấu trúc trải nghiệm</p><h2 id="product-anatomy-title">Ba lớp tạo nên một viên kẹo Fiuava.</h2></div></header>
    <ol class="product-anatomy__list">${[
      ['Nguồn xơ bã ổi','Phần bã sau ép được lựa chọn làm nguyên liệu đầu vào để thu nhận nguồn pectin và xơ hòa tan.'],
      ['Hương vị và kết cấu','Hương ổi chua ngọt đi cùng cấu trúc dai mềm, hướng đến cảm giác dễ ăn và không bết dính.'],
      ['Định dạng sử dụng','Viên kẹo nhỏ được gói riêng và đặt trong túi zip lớn, thuận tiện bảo quản và mang theo.']
    ].map(([title,copy],i)=>`<li><b>${String(i+1).padStart(2,'0')}</b><div><h3>${title}</h3><p>${copy}</p></div></li>`).join('')}</ol>
  </div></section>

  <section class="production-section" id="production-process" aria-labelledby="production-title"><div class="shell">
    <header class="product-section-heading production-heading"><div><p class="eyebrow">Quy trình phát triển &amp; sản xuất</p><h2 id="production-title">Từ bã ổi sau ép đến định dạng viên gói riêng.</h2></div><p>Quy trình phản ánh hướng phát triển hiện tại. Thông số vận hành, tiêu chuẩn kiểm nghiệm và điều kiện công bố cần được xác nhận trước khi thương mại hóa.</p></header>
    <ol class="production-flow">${[
      ['Thu nhận bã ổi','Tiếp nhận nguồn phụ phẩm từ quá trình chế biến ổi và sàng lọc nguyên liệu đầu vào.'],
      ['Sơ chế nguyên liệu','Làm sạch và xử lý bã ổi để chuẩn bị cho bước thu nhận phần xơ có giá trị.'],
      ['Thu nhận nguồn xơ','Tập trung vào pectin và phần xơ hòa tan dùng làm nền cho công thức sản phẩm.'],
      ['Phối trộn công thức','Điều chỉnh tỷ lệ nguyên liệu, hương ổi và cấu trúc để đạt trải nghiệm cảm quan mục tiêu.'],
      ['Tạo hình &amp; bao gói','Định hình viên kẹo, gói riêng từng viên và đưa vào túi zip lớn.'],
      ['Đánh giá trước công bố','Theo dõi cảm quan, độ ổn định và các chỉ tiêu an toàn cần thiết trước thương mại hóa.']
    ].map(([title,copy],i)=>`<li><div class="production-flow__marker"><b>${String(i+1).padStart(2,'0')}</b></div><div class="production-flow__copy"><h3>${title}</h3><p>${copy}</p></div></li>`).join('')}</ol>
  </div></section>

  <section class="quality-section shell" aria-labelledby="quality-title">
    <header class="product-section-heading"><div><p class="eyebrow">Điểm kiểm soát</p><h2 id="quality-title">Bốn nhóm thông tin cần được xác nhận ở mỗi mẻ.</h2></div><p>Đây là khung kiểm soát đề xuất, không phải tuyên bố rằng sản phẩm đã hoàn tất kiểm nghiệm hay được cấp phép lưu hành.</p></header>
    <div class="quality-ledger">${[
      ['01','Nguyên liệu đầu vào','Nguồn gốc, tình trạng bã ổi và điều kiện sơ chế.'],
      ['02','Công thức &amp; cảm quan','Độ phân bố nguyên liệu, màu, mùi, vị và kết cấu mục tiêu.'],
      ['03','Bao bì &amp; bảo quản','Độ kín của gói đơn, túi zip và thông tin nhãn sản phẩm.'],
      ['04','An toàn &amp; ổn định','Các chỉ tiêu vi sinh, hóa lý và thời gian ổn định cần kiểm nghiệm.']
    ].map(([number,title,copy])=>`<article><b>${number}</b><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div>
  </section>

  <section class="product-contact"><div class="shell product-contact__inner"><div><h2>Cần hồ sơ kỹ thuật chi tiết hơn?</h2><p>Liên hệ nhóm Fiuava để trao đổi về công thức, quy trình nghiên cứu hoặc cơ hội hợp tác.</p></div><a class="button button--primary" href="${routes.contact}">Liên hệ với chúng tôi</a></div></section>
</main>`;

const aboutPage = () => `<main id="main-content" class="about-page">
  ${pageHero('Câu chuyện thương hiệu', 'Một viên kẹo nhỏ bắt đầu từ một câu hỏi lớn.', 'Làm thế nào để nguồn chất xơ trong bã ổi không bị lãng phí, mà trở thành một lựa chọn hữu ích cho sức khỏe tiêu hóa?')}
  <section class="team-section team-section--lead"><div class="shell"><header class="section-title section-title--center"><p class="eyebrow">Đội ngũ phát triển Fiuava</p><h2>Năm thành viên, cùng phát triển một sản phẩm có ích.</h2><p>Đội ngũ cùng tham gia nghiên cứu sản phẩm, xây dựng mô hình kinh doanh và đưa Fiuava đến đúng nhóm khách hàng.</p></header><div class="team-grid">${[
    ['Nguyễn Hương Giang','team/ngo-ngoc-uyen-phuong.jpg'],
    ['Hồ Đặng Minh Trâm','team/nguyen-huong-giang.jpg'],
    ['Ngô Ngọc Uyên Phương','team/ho-dang-minh-tram.jpg'],
    ['Nguyễn Thành Phát','team/nguyen-thanh-phat.jpg'],
    ['Nguyễn Văn Việt','team/nguyen-van-viet.jpg']
  ].map(([name,src])=>`<article>${src ? `<figure class="team-photo"><img src="${asset(src)}" alt="Ảnh chân dung ${name}" width="800" height="1000" loading="lazy" decoding="async"></figure>` : imagePlaceholder(`Ảnh ${name}`, 'team-photo team-photo--placeholder')}<div><p>Thành viên dự án</p><h3>${name}</h3></div></article>`).join('')}</div></div></section>
  <section class="about-identity shell"><figure class="about-identity__media"><img src="${asset('team/fiuava-team-group.png')}" width="1128" height="1409" loading="lazy" decoding="async" alt="Năm thành viên đội ngũ phát triển Fiuava"></figure><div class="about-identity__copy"><p class="eyebrow">Chúng tôi là ai?</p><h2>Một nhóm trẻ theo đuổi thực phẩm xanh và tiện dụng.</h2><p>Fiuava được hình thành từ nhu cầu thực tế về một món ăn vặt an toàn, dễ sử dụng nhưng vẫn mang lại giá trị dinh dưỡng. Nhóm lựa chọn bã ổi — nguồn phụ phẩm dồi dào từ ngành chế biến nước ép — làm điểm bắt đầu cho hành trình nghiên cứu.</p><p>Mục tiêu không chỉ là tạo ra một viên kẹo ngon, mà còn xây dựng giải pháp có khả năng kết nối sức khỏe người dùng với giá trị tuần hoàn của nông sản Việt.</p><a class="text-link about-identity__website" href="https://fiuava.website/" target="_blank" rel="noreferrer">fiuava.website <span aria-hidden="true">↗</span></a></div></section>
  <section class="formation-section" aria-labelledby="formation-title"><div class="shell formation-layout"><header class="formation-heading"><p class="eyebrow">Câu chuyện hình thành Fiuava</p><h2 id="formation-title">Từ phần nguyên liệu bị bỏ quên đến một viên kẹo hữu ích.</h2><div class="formation-heading__copy"><p class="formation-lead">Bã ổi sau quá trình ép vẫn còn nguồn chất xơ tự nhiên có thể tiếp tục được khai thác.</p><p>Fiuava bắt đầu từ quan sát đó. Nhóm nghiên cứu cách thu nhận chất xơ, điều chỉnh hương vị và kết cấu để đưa nguồn nguyên liệu này vào một định dạng nhỏ gọn, gần gũi hơn với đời sống hằng ngày.</p></div></header><div class="foundation-list">${[
    ['Thông điệp','Biến một phần nguyên liệu thường bị bỏ lại thành lựa chọn nhỏ, dễ tiếp cận và dễ mang theo.'],
    ['Tầm nhìn','Phát triển thực phẩm từ nông sản Việt theo hướng có trách nhiệm và khai thác nguyên liệu hiệu quả hơn.'],
    ['Sứ mệnh','Kết nối sự tiện lợi trong đời sống hằng ngày với giá trị dinh dưỡng và tư duy tuần hoàn.'],
    ['Giá trị cốt lõi','Sáng tạo từ nhu cầu thật, minh bạch trong thông tin và trân trọng từng phần của nguyên liệu.']
  ].map(([title,copy],index)=>`<article><span aria-hidden="true">${String(index+1).padStart(2,'0')}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></div></section>
  <section class="project-value-section shell"><header class="section-title"><p class="eyebrow">Giá trị vượt trội</p><h2>Một dự án được thiết kế để tạo giá trị ở nhiều lớp.</h2></header><div class="project-value-list">${[
    ['Sáng tạo và tiên phong','Khai thác chất xơ từ bã ổi, đồng thời nghiên cứu sự kết hợp prebiotics – probiotics trong định dạng kẹo tiện dụng.'],
    ['Phù hợp đa dạng đối tượng','Hướng đến trẻ em, dân văn phòng, người ăn kiêng và người quan tâm đến lối sống lành mạnh.'],
    ['Giá trị kinh tế bền vững','Tận dụng phụ phẩm của ngành nước ép, góp phần giảm rác thải hữu cơ và hình thành chuỗi giá trị tuần hoàn.'],
    ['Khả năng mở rộng thị trường','Nguồn nguyên liệu dồi dào tạo tiền đề phát triển thêm định dạng, hương vị và thương hiệu dinh dưỡng Made in Vietnam.']
  ].map(([title,copy],i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div></section>
</main>`;

const radio = (name, title, options) => `<fieldset><legend>${title}</legend><div class="option-grid">${options.map((x)=>`<label><input type="radio" name="${name}" value="${x}" required><span>${x}</span></label>`).join('')}</div></fieldset>`;
const surveyPage = () => `<main id="main-content" class="survey-page">
  <section class="survey-masthead" aria-labelledby="survey-title"><div class="shell"><p class="eyebrow">Khảo sát phát triển sản phẩm</p><h1 id="survey-title">Giúp Fiuava hiểu điều bạn thực sự cần.</h1><p>Câu trả lời của bạn giúp nhóm điều chỉnh hương vị, kết cấu, bao bì và cách sản phẩm xuất hiện trong đời sống hằng ngày.</p></div></section>
  <section class="survey-layout shell"><aside class="survey-guide"><p>Khảo sát gồm ba phần</p><h2>Không có đáp án đúng hay sai.</h2><p>Hãy chọn phương án gần nhất với thói quen và mong muốn của bạn. Thông tin chỉ được dùng cho quá trình nghiên cứu, phát triển Fiuava.</p><ol aria-label="Các phần của khảo sát"><li><a href="#survey-habits"><span>01</span>Thói quen hiện tại</a></li><li><a href="#survey-product"><span>02</span>Trải nghiệm sản phẩm</a></li><li><a href="#survey-context"><span>03</span>Bối cảnh sử dụng</a></li></ol></aside><form class="survey-form js-form" data-form-type="survey" novalidate><label class="form-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label>
    <section class="survey-chapter" id="survey-habits" aria-labelledby="survey-habits-title"><header><span>01 / 03</span><h2 id="survey-habits-title">Thói quen hiện tại</h2><p>Một vài thông tin nền để nhóm hiểu cách bạn ăn nhẹ và quan tâm đến chất xơ.</p></header>
      ${radio('age','Bạn thuộc nhóm tuổi nào?',['Dưới 18','18–25','26–44','Trên 45'])}
      ${radio('role','Hoạt động chính hiện tại của bạn?',['Học sinh / sinh viên','Nhân viên văn phòng','Kinh doanh / tự do','Nội trợ / chăm sóc gia đình','Khác'])}
      ${radio('snack_frequency','Bạn thường ăn nhẹ với tần suất nào?',['Hầu như không','1–2 lần mỗi tuần','3–5 lần mỗi tuần','Hằng ngày'])}
      ${radio('produce_frequency','Rau hoặc trái cây xuất hiện trong bữa ăn của bạn ở mức nào?',['Hiếm khi','Khoảng một bữa mỗi ngày','Khoảng hai bữa mỗi ngày','Gần như mọi bữa'])}
      ${radio('fiber','Bạn quan tâm đến việc bổ sung chất xơ ở mức nào?',['Chưa quan tâm','Thỉnh thoảng','Khá quan tâm','Rất quan tâm'])}
    </section>
    <section class="survey-chapter" id="survey-product" aria-labelledby="survey-product-title"><header><span>02 / 03</span><h2 id="survey-product-title">Trải nghiệm sản phẩm</h2><p>Cho Fiuava biết điều gì khiến một viên kẹo trở nên dễ dùng hơn với bạn.</p></header>
      ${radio('priority','Khi chọn một món ăn nhẹ, điều gì quan trọng nhất?',['Hương vị','Thành phần rõ ràng','Tiện mang theo','Tận dụng nguyên liệu tốt hơn'])}
      ${radio('type','Bạn ưu tiên kết cấu nào?',['Kẹo dẻo mềm','Kẹo dai rõ hơn','Dễ tan khi sử dụng','Chưa xác định'])}
      ${radio('taste','Mức hương ổi bạn mong muốn?',['Thoang thoảng','Vừa phải','Đậm vị ổi','Không có ưu tiên'])}
      ${radio('sweetness','Độ ngọt nào phù hợp với bạn?',['Ít ngọt','Ngọt vừa','Ngọt rõ','Không có ưu tiên'])}
      ${radio('texture','Kích thước một viên kẹo nên như thế nào?',['Nhỏ, dùng nhanh','Vừa, dễ nhai','Lớn hơn để cảm nhận lâu','Chưa xác định'])}
    </section>
    <section class="survey-chapter" id="survey-context" aria-labelledby="survey-context-title"><header><span>03 / 03</span><h2 id="survey-context-title">Bối cảnh sử dụng</h2><p>Phần cuối tập trung vào thời điểm, kích thước gói và thông tin bạn muốn nhìn thấy.</p></header>
      ${radio('usage_time','Bạn dễ dùng Fiuava nhất vào thời điểm nào?',['Sau một bữa ăn vội','Trong giờ nghỉ giữa ngày','Trên đường đi học / đi làm','Khi đi chơi hoặc di chuyển'])}
      ${radio('pack_size','Kích thước gói nào thuận tiện hơn?',['Gói nhỏ 5–7 viên','Gói vừa 10–15 viên','Gói lớn để chia sẻ','Gói dùng thử trước'])}
      ${radio('label_info','Thông tin nào trên bao bì bạn quan tâm nhất?',['Thành phần và nguồn chất xơ','Thông tin dinh dưỡng','Hướng dẫn bảo quản','Câu chuyện tận dụng bã ổi'])}
      ${radio('trial','Nếu Fiuava có đợt dùng thử, bạn sẽ cân nhắc thế nào?',['Sẵn sàng tham gia','Có thể tham gia','Cần thêm thông tin','Chưa có nhu cầu'])}
      <label class="text-field"><span>Điều bạn mong chờ nhất ở Fiuava <small>(không bắt buộc)</small></span><textarea name="message" rows="5" placeholder="Hương vị, kết cấu, bao bì hoặc điều bạn muốn nhóm cải thiện…"></textarea></label>
    </section>
    <div class="form-actions"><button class="button button--primary" type="submit">Gửi câu trả lời <b aria-hidden="true">→</b></button><p>Gửi một lần khi bạn đã hoàn thành cả ba phần.</p></div><p class="form-status" role="status" hidden></p>
  </form></section>
</main>`;

const contactPage = () => `<main id="main-content" class="contact-page">
  <section class="contact-stage" aria-labelledby="contact-title"><div class="shell">
    <header class="contact-intro"><p class="eyebrow">Liên hệ Fiuava</p><h1 id="contact-title">Có điều muốn trao đổi? Hãy viết cho chúng tôi.</h1><p>Sản phẩm, nghiên cứu hay một đề nghị hợp tác — mọi lời nhắn đều được chính nhóm Fiuava đọc và phản hồi.</p></header>
    <div class="contact-workspace"><form class="contact-form js-form" data-form-type="contact" novalidate><label class="form-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><header class="contact-form__head"><h2>Gửi lời nhắn</h2><p>Các mục có nhãn rõ ràng đều cần được hoàn thành trước khi gửi.</p></header><div class="field-row"><label class="text-field"><span>Họ và tên</span><input name="name" autocomplete="name" required placeholder="Tên của bạn"></label><label class="text-field"><span>Số điện thoại</span><input name="phone" inputmode="tel" autocomplete="tel" required placeholder="Số điện thoại"></label></div><div class="field-row"><label class="text-field"><span>Địa chỉ email</span><input type="email" name="email" autocomplete="email" required placeholder="email@example.com"></label><label class="text-field"><span>Chủ đề trao đổi</span><select name="topic" required><option value="" selected disabled>Chọn nội dung</option><option value="Sản phẩm">Sản phẩm</option><option value="Hợp tác">Hợp tác</option><option value="Nghiên cứu">Nghiên cứu</option><option value="Khác">Nội dung khác</option></select></label></div><label class="text-field"><span>Nội dung lời nhắn</span><textarea name="message" rows="7" required placeholder="Bạn muốn trao đổi điều gì?"></textarea></label><div class="contact-form__footer"><button class="button button--primary" type="submit">Gửi lời nhắn <b aria-hidden="true">→</b></button><p class="contact-form__note">${icon('shield')} Thông tin chỉ được dùng để phản hồi yêu cầu này.</p></div><p class="form-status" role="status" hidden></p></form>
      <aside class="contact-rail"><section class="contact-details" aria-labelledby="contact-details-title"><h2 id="contact-details-title">Liên hệ trực tiếp</h2><p>Nếu không muốn dùng biểu mẫu, bạn có thể chọn một trong các kênh dưới đây.</p><div class="contact-list">${contactItems}</div></section><section class="contact-map-card" aria-labelledby="map-title"><div id="contact-map" class="contact-map" role="region" aria-label="Bản đồ 140 Lê Trọng Tấn, phường Tây Thạnh, Thành phố Hồ Chí Minh"></div><div class="contact-map-card__copy"><p class="eyebrow">Địa chỉ</p><h2 id="map-title">Điểm liên hệ Fiuava</h2><p>140 Lê Trọng Tấn, phường Tây Thạnh, TP. Hồ Chí Minh</p><a class="text-link" href="https://maps.google.com/?q=140+Lê+Trọng+Tấn,+phường+Tây+Thạnh,+TP.+Hồ+Chí+Minh" target="_blank" rel="noreferrer">Mở trên Google Maps <span>↗</span></a></div></section></aside>
    </div>
  </div></section>
</main>`;

const pages = { home: homePage, introduce: introducePage, about: aboutPage, survey: surveyPage, contact: contactPage };
app.innerHTML = `${header()}${(pages[page] || homePage)()}${footer()}<button class="back-to-top" type="button" aria-label="Về đầu trang">↑</button>`;

document.querySelector('[data-year]').textContent = new Date().getFullYear();
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded', String(!open)); nav.classList.toggle('is-open', !open); });
nav.addEventListener('click', (event) => { if (event.target.closest('a')) { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); } });

const topButton = document.querySelector('.back-to-top');
const syncTopButton = () => topButton.classList.toggle('is-visible', window.scrollY > 600);
window.addEventListener('scroll', syncTopButton, { passive: true }); syncTopButton();
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const contactMap = document.querySelector('#contact-map');
if (contactMap) {
  const initContactMap = async () => {
    const [{ default: L }] = await Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]);
    const areaCenter = [10.8070354, 106.6287031];
    const map = L.map(contactMap, { scrollWheelZoom: false, zoomControl: true }).setView(areaCenter, 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    const markerIcon = L.divIcon({ className: 'contact-map-marker', html: '<span aria-hidden="true"></span>', iconSize: [44, 44], iconAnchor: [22, 42] });
    L.marker(areaCenter, { icon: markerIcon, title: '140 Lê Trọng Tấn, phường Tây Thạnh' }).addTo(map).bindPopup('<strong>Điểm liên hệ Fiuava</strong><br>140 Lê Trọng Tấn, phường Tây Thạnh, TP. Hồ Chí Minh');
    window.addEventListener('load', () => map.invalidateSize(), { once: true });
  };
  initContactMap();
}

const revealTargets = document.querySelectorAll([
    '.morning-hero__copy',
    '.morning-hero__visual',
    '.moment-card',
    '.open-layers > *',
    '.journey-track > *',
    '.diary-line > *',
    '.page-hero-grid > *',
    '.product-showcase__grid > *',
    '.product-overview .product-section-heading > *',
    '.product-overview__statement',
    '.product-spec-ledger > *',
    '.product-anatomy .product-section-heading',
    '.product-anatomy__list > *',
    '.production-heading > *',
    '.production-flow > *',
    '.quality-section .product-section-heading > *',
    '.quality-ledger > *',
    '.product-contact__inner > *',
  ].join(','));

revealTargets.forEach((element, index) => {
  element.dataset.reveal = '';
  element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
  revealTargets.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  revealTargets.forEach((element) => revealObserver.observe(element));
}

const rhythmQuiz = document.querySelector('.rhythm-quiz');
if (rhythmQuiz) {
  const result = rhythmQuiz.querySelector('.rhythm-result');
  rhythmQuiz.addEventListener('change', () => {
    const answered = new Set([...new FormData(rhythmQuiz).keys()]).size;
    result.hidden = answered < 3;
  });
}

const formErrorMessage = (error) => {
  if (error.message === 'MISSING_ENDPOINT') return 'Biểu mẫu chưa được kết nối Google Sheet. Vui lòng cấu hình VITE_GOOGLE_SHEETS_ENDPOINT.';
  if (error.message === 'INVALID_ENDPOINT') return 'Địa chỉ Google Apps Script không hợp lệ. Hãy dùng URL triển khai kết thúc bằng /exec.';
  if (error.message === 'REQUEST_TIMEOUT') return 'Kết nối quá thời gian. Vui lòng kiểm tra mạng và thử lại.';
  return 'Chưa thể gửi dữ liệu. Vui lòng thử lại hoặc liên hệ qua Zalo 0364 531 571.';
};

document.querySelectorAll('.js-form').forEach((form) => form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) { form.reportValidity(); status.hidden = false; status.dataset.state = 'error'; status.textContent = 'Vui lòng hoàn thành các mục bắt buộc.'; return; }
  const button = form.querySelector('[type="submit"]');
  const originalLabel = button.innerHTML;
  const values = Object.fromEntries(new FormData(form).entries());
  button.disabled = true; button.setAttribute('aria-busy', 'true'); button.textContent = 'Đang gửi…';
  status.hidden = false; status.dataset.state = 'loading'; status.textContent = 'Đang kết nối và lưu dữ liệu…';

  try {
    const config = getGoogleSheetsConfig();
    await submitToGoogleSheets({ ...config, formType: form.dataset.formType, values });
    status.dataset.state = 'success';
    status.textContent = form.dataset.formType === 'contact'
      ? 'Cảm ơn bạn! Nội dung đã được gửi tới lienhe@fiuava.website.'
      : 'Cảm ơn bạn! Dữ liệu đã được gửi đến Fiuava.';
    form.reset();
  } catch (error) {
    status.dataset.state = 'error'; status.textContent = formErrorMessage(error);
  } finally {
    button.disabled = false; button.removeAttribute('aria-busy'); button.innerHTML = originalLabel;
  }
}));
