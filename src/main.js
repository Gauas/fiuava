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
  ['home', 'Trang chủ'],
  ['introduce', 'Sản phẩm'],
  ['about', 'Câu chuyện Fiuava'],
  ['survey', 'Khảo sát'],
  ['contact', 'Liên hệ'],
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
        ${navItems.map(([id, label]) => `<a href="${routes[id]}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
        <a class="nav-cta" href="${routes.contact}">${icon('bag')} Tìm hiểu ngay</a>
      </nav>
    </div>
  </header>`;

const contactItems = `
  <a href="tel:+84364531571">${icon('phone')}<span><small>Điện thoại / Zalo</small>0364 531 571</span></a>
  <a href="mailto:vanviet12022004@gmail.com">${icon('mail')}<span><small>Email</small>vanviet12022004@gmail.com</span></a>
  <a href="https://maps.google.com/?q=140+Lê+Trọng+Tấn" target="_blank" rel="noreferrer">${icon('pin')}<span><small>Địa chỉ</small>140 Lê Trọng Tấn</span></a>`;

const footer = () => `
  <section class="closing-cta">
    <div class="shell closing-inner">
      <div><h2>Nhẹ bụng mỗi ngày cùng Fiuava</h2><p>Một viên kẹo nhỏ, thêm một lựa chọn dễ chịu cho hệ tiêu hóa.</p></div>
      <a class="button button--light" href="${routes.contact}">${icon('bag')} Liên hệ ngay</a>
    </div>
  </section>
  <footer class="site-footer">
    <div class="shell footer-grid">
      <section class="footer-brand">
        <img src="${asset('logo.png')}" width="499" height="446" alt="Fiuava" />
        <p>Kẹo dinh dưỡng tiện lợi từ nguồn chất xơ tự nhiên thu nhận từ phụ phẩm bã ổi.</p>
      </section>
      <section><h2>Khám phá</h2><ul>${navItems.slice(1).map(([id, label]) => `<li><a href="${routes[id]}">${label}</a></li>`).join('')}</ul></section>
      <section><h2>Liên hệ</h2><div class="footer-contact">${contactItems}</div></section>
    </div>
    <div class="shell footer-bottom"><span>© <span data-year></span> Fiuava.</span><span>Kẹo dinh dưỡng từ chất xơ bã ổi.</span></div>
  </footer>`;

const benefits = [
  ['leaf', 'Chất xơ từ bã ổi', 'Tận dụng phụ phẩm tự nhiên để tạo nên lựa chọn dinh dưỡng tiện lợi.'],
  ['candy', 'Hai dạng kẹo dễ dùng', 'Kẹo dẻo dai mềm cho trẻ em và gum tan probiotics cho người ăn kiêng.'],
  ['heart', 'Hương ổi dễ chịu', 'Kết cấu hấp dẫn, vị thơm ngọt tự nhiên và dễ mang theo mỗi ngày.'],
  ['recycle', 'Hướng đến tiêu hóa khỏe', 'Hỗ trợ bổ sung chất xơ, cân bằng hệ vi sinh và sức khỏe tổng thể.'],
];

const imagePlaceholder = (label, className = '') => `
  <figure class="media-placeholder ${className}" role="img" aria-label="${label}">
    <span aria-hidden="true">+</span><figcaption>${label}</figcaption>
  </figure>`;

const audiences = [
  ['Trẻ em', 'Kẹo dẻo dai mềm giúp việc bổ sung chất xơ trở nên gần gũi và dễ ăn hơn.', 'audience/tre-em.jpg'],
  ['Người ăn kiêng', 'Kẹo gum tan kết hợp probiotics cùng chất tạo ngọt ăn kiêng cho nhu cầu hằng ngày.', 'audience/nguoi-an-kieng.jpg'],
  ['Người chú trọng tiêu hóa', 'Một lựa chọn tiện lợi hướng đến bổ sung chất xơ và cân bằng hệ vi sinh đường ruột.', 'audience/nguoi-chu-trong-tieu-hoa.jpg'],
  ['Gia đình', 'Hương ổi dễ chịu, gói nhỏ gọn và phù hợp với nhiều nhu cầu sử dụng khác nhau.', 'audience/gia-dinh.jpg'],
];

const homePage = () => `
  <main id="main-content">
    <section class="hero">
      <div class="hero-orbit hero-orbit--one" aria-hidden="true"></div><div class="hero-orbit hero-orbit--two" aria-hidden="true"></div>
      <div class="shell hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Kẹo dinh dưỡng từ bã ổi</p>
          <h1>Ngọt vị ổi,<br><span>nhẹ bụng mỗi ngày.</span></h1>
          <p class="hero-lead">Fiuava kết hợp chất xơ tự nhiên, hương ổi thơm dịu và hai công thức chuyên biệt cho trẻ em lẫn người kiểm soát cân nặng.</p>
          <div class="button-row"><a class="button button--primary" href="${routes.introduce}">Khám phá sản phẩm <b aria-hidden="true">→</b></a><a class="button button--outline" href="${routes.about}">Câu chuyện Fiuava</a></div>
          <ul class="hero-notes"><li>${icon('leaf')}Chất xơ tự nhiên</li><li>${icon('candy')}Tiện mang theo</li><li>${icon('heart')}Hương ổi dễ ăn</li></ul>
        </div>
        <figure class="hero-product"><span class="fruit-disc" aria-hidden="true"></span><img src="${asset('product-cutout.png')}" width="512" height="487" alt="Sản phẩm kẹo dinh dưỡng Fiuava" /></figure>
      </div>
    </section>

    <section class="interest-section shell" aria-labelledby="interest-title">
      <header class="section-title interest-heading"><p class="eyebrow">Điểm khác biệt</p><h2 id="interest-title">Những điều thú vị về Fiuava</h2></header>
      <div class="interest-layout">
        <figure class="interest-visual"><img src="${asset('interest-lifestyle.jpg')}" width="1448" height="1086" loading="lazy" decoding="async" alt="Một viên kẹo Fiuava được cầm trên tay bên cạnh ổi hồng và gói sản phẩm"><figcaption><span>Fiuava trong một khoảnh khắc thường ngày.</span><small>Nhỏ gọn để mang theo, gần gũi để bắt đầu.</small></figcaption></figure>
        <div class="interest-list">
          ${benefits.map(([name, title, copy]) => `<article class="interest-note"><span aria-hidden="true">${icon(name)}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}
        </div>
      </div>
    </section>

    <section class="story-section shell">
      <div class="story-media"><figure class="story-product-frame"><img src="${asset('story-guava-product.jpg')}" width="1254" height="1254" loading="lazy" decoding="async" alt="Gói kẹo Fiuava hòa vào nửa quả ổi hồng giữa lá và hoa ổi"></figure></div>
      <div class="story-copy"><p class="eyebrow">Câu chuyện Fiuava</p><h2>Từ phần bã ổi bị bỏ quên đến viên kẹo giàu giá trị.</h2><p>Fiuava được phát triển từ mong muốn biến nguồn chất xơ trong phụ phẩm bã ổi thành một sản phẩm ngon, gọn và dễ duy trì mỗi ngày.</p><p>Hai phiên bản được thiết kế cho hai nhu cầu riêng: giúp trẻ em bổ sung chất xơ dễ dàng hơn, và hỗ trợ người kiểm soát cân nặng với probiotics cùng chất tạo ngọt ăn kiêng.</p><ul class="story-points"><li>${icon('recycle')}Tận dụng nguyên liệu</li><li>${icon('leaf')}Công thức có định hướng</li><li>${icon('heart')}Dễ dùng cho gia đình</li></ul><a class="text-link" href="${routes.about}">Đọc câu chuyện của chúng tôi <span>→</span></a></div>
    </section>

    <section class="audience-section" id="audience">
      <div class="shell"><header class="section-title section-title--center"><h2>Fiuava Dành Cho</h2></header>
        <div class="audience-cards">${audiences.map(([title, copy, src]) => `<article><div><h3>${title}</h3><p>${copy}</p></div>${src ? `<figure class="audience-photo"><img src="${asset(src)}" width="900" height="600" loading="lazy" decoding="async" alt="Hình minh họa cho ${title}"></figure>` : imagePlaceholder(`Ảnh minh họa: ${title}`)}</article>`).join('')}</div>
      </div>
    </section>

    <section class="feedback-section" id="feedback">
      <div class="shell"><header class="section-title section-title--center"><p class="eyebrow">Lắng nghe để hoàn thiện</p><h2>Cảm nhận của khách hàng</h2><p>Phản hồi thực tế sẽ được cập nhật sau các đợt khảo sát và trải nghiệm sản phẩm.</p></header>
        <div class="feedback-grid">
          <article><div class="feedback-card-head"><span class="quote-mark" aria-hidden="true">“</span><b>01</b></div><p>Nhóm phát triển đang tổng hợp cảm nhận về độ chua ngọt của hương ổi, kết cấu dai mềm và mức độ dễ ăn của sản phẩm.</p><div class="feedback-person"><span class="feedback-avatar" aria-hidden="true">K1</span><div><strong>Tên khách hàng đang cập nhật</strong><small>Hương vị &amp; kết cấu</small></div></div></article>
          <article><div class="feedback-card-head"><span class="quote-mark" aria-hidden="true">“</span><b>02</b></div><p>Các ý kiến về kích thước viên kẹo, khả năng mang theo và sự thuận tiện khi sử dụng hằng ngày đang được ghi nhận.</p><div class="feedback-person"><span class="feedback-avatar" aria-hidden="true">K2</span><div><strong>Tên khách hàng đang cập nhật</strong><small>Trải nghiệm sử dụng</small></div></div></article>
          <article><div class="feedback-card-head"><span class="quote-mark" aria-hidden="true">“</span><b>03</b></div><p>Khảo sát tiếp tục ghi nhận mức độ phù hợp của hai công thức với nhu cầu bổ sung chất xơ và lối sống của từng nhóm người dùng.</p><div class="feedback-person"><span class="feedback-avatar" aria-hidden="true">K3</span><div><strong>Tên khách hàng đang cập nhật</strong><small>Mức độ phù hợp</small></div></div></article>
        </div>
        <div class="feedback-action"><a class="button button--outline" href="${routes.survey}">Chia sẻ cảm nhận</a></div>
      </div>
    </section>

    <section class="survey-band"><div class="shell survey-band-inner"><div><p class="eyebrow">Cùng hoàn thiện Fiuava</p><h2>Hương vị nào phù hợp với bạn?</h2><p>Chia sẻ nhu cầu và trải nghiệm mong muốn trong khảo sát ngắn của chúng tôi.</p></div><a class="button button--primary" href="${routes.survey}">Tham gia khảo sát <b aria-hidden="true">→</b></a></div></section>
  </main>`;

const pageHero = (eyebrow, title, copy, product = false) => `<section class="page-hero"><div class="shell page-hero-grid"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${copy}</p></div>${product ? `<figure><img src="${asset('product.png')}" width="617" height="587" alt="Sản phẩm Fiuava" /></figure>` : ''}</div></section>`;

const introducePage = () => `<main id="main-content">
  ${pageHero('Sản phẩm Fiuava', 'Hai công thức, chung một nguồn chất xơ tự nhiên.', 'Kẹo dinh dưỡng tiện lợi từ phụ phẩm bã ổi, được phát triển cho trẻ em và người theo đuổi lối sống cân bằng.', true)}
  <section class="product-intro shell"><div class="product-intro__copy"><p class="eyebrow">Giới thiệu Fiuava</p><h2>Biến nguồn xơ tự nhiên thành một thói quen dễ duy trì.</h2><p>Fiuava tận dụng nguồn chất xơ tự nhiên thu nhận từ phụ phẩm bã ổi để phát triển hai phiên bản kẹo chuyên biệt. Cả hai cùng hướng đến trải nghiệm nhỏ gọn, dễ ăn, mang hương ổi chua ngọt hài hòa và hỗ trợ người dùng chủ động chăm sóc hệ tiêu hóa trong nhịp sống hằng ngày.</p><p>Sản phẩm được định hướng phù hợp với nhiều nhu cầu: trẻ em ít ăn rau, dân văn phòng, người ăn kiêng và người quan tâm đến việc kiểm soát lượng đường nạp vào cơ thể.</p></div>${imagePlaceholder('Ảnh nguyên liệu bã ổi và nguồn chất xơ Fiuava', 'product-intro__media')}</section>
  <section class="detail-section"><div class="shell"><header class="section-title section-title--center"><p class="eyebrow">Hai phiên bản chuyên biệt</p><h2>Mỗi kết cấu giải quyết một nhu cầu khác nhau.</h2></header><div class="product-detail-grid">
    <article class="product-detail-card"><div class="product-detail-card__body"><span class="product-number">01</span><p class="product-detail-card__audience">Dành cho trẻ em</p><h3>Kẹo dẻo dai mềm</h3><p>Kết cấu dai mềm, không bết dính, vị ổi chua ngọt và màu sắc tự nhiên giúp trải nghiệm bổ sung chất xơ trở nên gần gũi hơn.</p><ul><li>Nguồn pectin và xơ hòa tan từ bã ổi</li><li>Định hướng prebiotics hỗ trợ hệ vi sinh đường ruột</li><li>Viên nhỏ, dễ ăn và dễ mang theo</li></ul></div>${imagePlaceholder('Ảnh riêng dòng kẹo dẻo Fiuava')}</article>
    <article class="product-detail-card"><div class="product-detail-card__body"><span class="product-number">02</span><p class="product-detail-card__audience">Dành cho người ăn kiêng</p><h3>Kẹo gum tan probiotics</h3><p>Cấu trúc đa tầng với lớp vỏ mỏng hơi giòn và phần nhân nhai tan, kết hợp probiotics cùng chất tạo ngọt ăn kiêng.</p><ul><li>Định hướng phối hợp prebiotics và probiotics</li><li>Phù hợp nhu cầu kiểm soát đường và năng lượng</li><li>Hương ổi dễ chịu, định dạng tiện dụng</li></ul></div>${imagePlaceholder('Ảnh riêng dòng kẹo gum tan Fiuava')}</article>
  </div></div></section>
  <section class="process-section" id="process"><div class="shell"><header class="section-title process-heading"><div><p class="eyebrow">Quy trình phát triển</p><h2>Từ phụ phẩm bã ổi đến viên kẹo hoàn thiện.</h2></div><p>Quy trình được trình bày theo định hướng nghiên cứu hiện tại; các chỉ tiêu công thức và chất lượng tiếp tục được đánh giá trước khi thương mại hóa.</p></header><ol class="process-list">${[
    ['Thu nhận bã ổi','Lựa chọn nguồn phụ phẩm từ quá trình chế biến nước ép.'],
    ['Sơ chế nguyên liệu','Làm sạch và xử lý nguyên liệu để chuẩn bị thu nhận chất xơ.'],
    ['Thu nhận nguồn xơ','Tập trung vào pectin và phần xơ hòa tan có giá trị.'],
    ['Phát triển công thức','Thiết kế riêng công thức kẹo dẻo và gum tan probiotics.'],
    ['Đánh giá cảm quan','Điều chỉnh hương vị, kết cấu và mục tiêu ổn định sản phẩm.'],
    ['Hoàn thiện định dạng','Lựa chọn viên kẹo và bao bì nhỏ gọn trước bước kiểm nghiệm tiếp theo.']
  ].map(([title,copy],i)=>`<li><b>${String(i+1).padStart(2,'0')}</b><div><span>${title}</span><p>${copy}</p></div></li>`).join('')}</ol></div></section>
  <section class="product-features shell"><header class="section-title"><p class="eyebrow">Đặc tính thiết kế</p><h2>Nhỏ gọn bên ngoài, có chủ đích bên trong.</h2></header><div class="feature-strips">${[
    ['Nguồn nguyên liệu','Chất xơ tự nhiên thu nhận từ phụ phẩm bã ổi.'],
    ['Trải nghiệm cảm quan','Hai cấu trúc dai mềm và gum tan, cùng hương ổi tự nhiên.'],
    ['Tính tiện dụng','Định dạng viên nhỏ; định hướng đóng gói tuýp, hũ hoặc túi zip.'],
    ['Mục tiêu phát triển','Hướng đến độ ổn định ở nhiệt độ thường và trải nghiệm sử dụng hằng ngày.']
  ].map(([title,copy],i)=>`<article><b>${String(i+1).padStart(2,'0')}</b><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div></section>
  <section class="info-banner shell"><div><h2>Bạn muốn tìm hiểu sâu hơn về Fiuava?</h2><p>Liên hệ nhóm phát triển để trao đổi về sản phẩm, nghiên cứu hoặc cơ hội hợp tác.</p></div><a class="button button--primary" href="${routes.contact}">Liên hệ với chúng tôi</a></section>
</main>`;

const aboutPage = () => `<main id="main-content">
  ${pageHero('Câu chuyện thương hiệu', 'Một viên kẹo nhỏ bắt đầu từ một câu hỏi lớn.', 'Làm thế nào để nguồn chất xơ trong bã ổi không bị lãng phí, mà trở thành một lựa chọn hữu ích cho sức khỏe tiêu hóa?')}
  <section class="team-section team-section--lead"><div class="shell"><header class="section-title section-title--center"><p class="eyebrow">Đội ngũ phát triển Fiuava</p><h2>Năm thành viên, cùng phát triển một sản phẩm có ích.</h2><p>Đội ngũ cùng tham gia nghiên cứu sản phẩm, xây dựng mô hình kinh doanh và đưa Fiuava đến đúng nhóm khách hàng.</p></header><div class="team-grid">${[
    ['Ngô Ngọc Uyên Phương','team/ngo-ngoc-uyen-phuong.jpg'],
    ['Nguyễn Hương Giang','team/nguyen-huong-giang.jpg'],
    ['Hồ Đặng Minh Trâm','team/ho-dang-minh-tram.jpg'],
    ['Nguyễn Thành Phát','team/nguyen-thanh-phat.jpg'],
    ['Nguyễn Văn Việt','team/nguyen-van-viet.jpg']
  ].map(([name,src])=>`<article>${src ? `<figure class="team-photo"><img src="${asset(src)}" alt="Ảnh chân dung ${name}" width="800" height="1000" loading="lazy" decoding="async"></figure>` : imagePlaceholder(`Ảnh ${name}`, 'team-photo team-photo--placeholder')}<div><p>Thành viên dự án</p><h3>${name}</h3></div></article>`).join('')}</div></div></section>
  <section class="about-identity shell">${imagePlaceholder('Ảnh tập thể đội ngũ Fiuava', 'about-identity__media')}<div><p class="eyebrow">Chúng tôi là ai?</p><h2>Một nhóm trẻ theo đuổi thực phẩm xanh và tiện dụng.</h2><p>Fiuava được hình thành từ nhu cầu thực tế về một món ăn vặt an toàn, dễ sử dụng nhưng vẫn mang lại giá trị dinh dưỡng. Nhóm lựa chọn bã ổi — nguồn phụ phẩm dồi dào từ ngành chế biến nước ép — làm điểm bắt đầu cho hành trình nghiên cứu.</p><p>Mục tiêu không chỉ là tạo ra một viên kẹo ngon, mà còn xây dựng giải pháp có khả năng kết nối sức khỏe người dùng với giá trị tuần hoàn của nông sản Việt.</p></div></section>
  <section class="formation-section"><div class="shell"><header class="formation-heading"><div class="formation-heading__title"><p class="eyebrow">Câu chuyện hình thành Fiuava</p><h2>Từ phần nguyên liệu bị bỏ quên đến hai dòng kẹo chuyên biệt.</h2></div><div class="formation-heading__copy"><p>Ý tưởng dự án bắt đầu khi nhóm nhận thấy bã ổi sau quá trình ép vẫn còn nguồn chất xơ tự nhiên có thể khai thác. Thay vì để nguồn nguyên liệu này trở thành rác thải hữu cơ, Fiuava nghiên cứu cách thu nhận chất xơ và đưa vào định dạng kẹo dễ tiếp cận.</p><p>Hai phiên bản được phát triển cho hai nhóm nhu cầu rõ ràng: kẹo dẻo cho trẻ em ít ăn rau và gum tan probiotics cho người ăn kiêng hoặc quan tâm đến kiểm soát lượng đường.</p></div></header><div class="foundation-grid">${[
    ['candy','Thông điệp','Một viên kẹo nhỏ có thể mở ra lựa chọn bổ sung chất xơ gần gũi và dễ duy trì hơn.'],
    ['leaf','Tầm nhìn','Phát triển thương hiệu thực phẩm xanh – sạch, khai thác bền vững giá trị của nông sản Việt.'],
    ['heart','Sứ mệnh','Kết nối dinh dưỡng tiện lợi với nhu cầu thật của trẻ em, người ăn kiêng và cộng đồng sống khỏe.'],
    ['recycle','Giá trị cốt lõi','Sáng tạo, thấu hiểu và tuần hoàn: giảm lãng phí phụ phẩm, nâng cao chuỗi giá trị nội địa.']
  ].map(([iconName,title,copy])=>`<article><span class="icon-medallion">${icon(iconName)}</span><h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></div></section>
  <section class="project-value-section shell"><header class="section-title"><p class="eyebrow">Giá trị vượt trội</p><h2>Một dự án được thiết kế để tạo giá trị ở nhiều lớp.</h2></header><div class="project-value-list">${[
    ['Sáng tạo và tiên phong','Khai thác chất xơ từ bã ổi, đồng thời nghiên cứu sự kết hợp prebiotics – probiotics trong định dạng kẹo tiện dụng.'],
    ['Phù hợp đa dạng đối tượng','Hướng đến trẻ em, dân văn phòng, người ăn kiêng và người quan tâm đến lối sống lành mạnh.'],
    ['Giá trị kinh tế bền vững','Tận dụng phụ phẩm của ngành nước ép, góp phần giảm rác thải hữu cơ và hình thành chuỗi giá trị tuần hoàn.'],
    ['Khả năng mở rộng thị trường','Nguồn nguyên liệu dồi dào tạo tiền đề phát triển thêm định dạng, hương vị và thương hiệu dinh dưỡng Made in Vietnam.']
  ].map(([title,copy],i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><div><h3>${title}</h3><p>${copy}</p></div></article>`).join('')}</div></section>
</main>`;

const radio = (name, title, options) => `<fieldset><legend>${title}</legend><div class="option-grid">${options.map((x)=>`<label><input type="radio" name="${name}" value="${x}" required><span>${x}</span></label>`).join('')}</div></fieldset>`;
const surveyPage = () => `<main id="main-content">
  ${pageHero('Khảo sát Fiuava', 'Ý kiến của bạn giúp sản phẩm tốt hơn.', 'Khảo sát ngắn về nhu cầu bổ sung chất xơ, hương vị và định dạng sản phẩm phù hợp.')}
  <section class="form-shell shell"><form class="survey-form js-form" data-form-type="survey" novalidate><label class="form-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><div class="form-intro"><span>01</span><div><h2>Thông tin và thói quen</h2><p>Vui lòng chọn phương án gần nhất với bạn.</p></div></div>
    ${radio('age','Bạn thuộc nhóm tuổi nào?',['Dưới 18','18–25','26–44','Trên 45'])}
    ${radio('fiber','Bạn quan tâm đến việc bổ sung chất xơ ở mức nào?',['Chưa quan tâm','Thỉnh thoảng','Khá quan tâm','Rất quan tâm'])}
    ${radio('type','Bạn ưu tiên phiên bản nào?',['Kẹo dẻo dai mềm','Kẹo gum tan probiotics','Cả hai','Chưa xác định'])}
    ${radio('taste','Mức hương ổi bạn mong muốn?',['Thoang thoảng','Vừa phải','Đậm vị ổi','Không có ưu tiên'])}
    <label class="text-field"><span>Điều bạn mong chờ nhất ở Fiuava <small>(không bắt buộc)</small></span><textarea name="message" rows="4" placeholder="Chia sẻ thêm với chúng tôi…"></textarea></label>
    <div class="form-actions"><button class="button button--primary" type="submit">Gửi khảo sát <b aria-hidden="true">→</b></button></div><p class="form-status" role="status" hidden></p>
  </form></section>
</main>`;

const contactPage = () => `<main id="main-content">
  ${pageHero('Liên hệ', 'Chúng tôi luôn sẵn lòng lắng nghe.', 'Trao đổi về sản phẩm, nghiên cứu hoặc cơ hội hợp tác cùng Fiuava.')}
  <section class="contact-section shell"><aside><p class="eyebrow">Thông tin liên hệ</p><h2>Kết nối với Fiuava</h2><p>Nhóm sẽ phản hồi trong thời gian sớm nhất qua kênh bạn lựa chọn.</p><div class="contact-list">${contactItems}</div></aside>
    <form class="contact-form js-form" data-form-type="contact" novalidate><label class="form-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off"></label><div class="field-row"><label class="text-field"><span>Họ và tên</span><input name="name" autocomplete="name" required></label><label class="text-field"><span>Số điện thoại</span><input name="phone" inputmode="tel" autocomplete="tel" required></label></div><label class="text-field"><span>Email</span><input type="email" name="email" autocomplete="email" required></label><label class="text-field"><span>Nội dung</span><textarea name="message" rows="5" required placeholder="Bạn muốn trao đổi điều gì?"></textarea></label><button class="button button--primary" type="submit">Gửi lời nhắn <b aria-hidden="true">→</b></button><p class="form-status" role="status" hidden></p></form>
  </section>
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

const revealTargets = document.querySelectorAll([
    '.hero-copy',
    '.hero-product',
    '.interest-section .section-title',
    '.interest-visual',
    '.interest-note',
    '.story-section > *',
    '.audience-section .section-title',
    '.audience-cards > *',
    '.feedback-section .section-title',
    '.feedback-grid > *',
    '.feedback-action',
    '.survey-band-inner > *',
    '.page-hero-grid > *',
    '.product-intro > *',
    '.product-detail-grid',
    '.process-heading',
    '.process-list',
    '.product-features .section-title',
    '.feature-strips',
    '.about-identity > *',
    '.formation-heading',
    '.foundation-grid',
    '.project-value-section .section-title',
    '.project-value-list',
    '.team-section .section-title',
    '.team-grid',
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
    status.textContent = 'Cảm ơn bạn! Dữ liệu đã được gửi đến Fiuava.';
    form.reset();
  } catch (error) {
    status.dataset.state = 'error'; status.textContent = formErrorMessage(error);
  } finally {
    button.disabled = false; button.removeAttribute('aria-busy'); button.innerHTML = originalLabel;
  }
}));
