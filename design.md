# Design — GuavaFiber

Hệ thống thiết kế thống nhất cho website đa trang GuavaFiber, được điều chỉnh theo ảnh thiết kế do người dùng cung cấp và nhận diện thật của sản phẩm.

## Genre
Playful có tiết chế: thân thiện, mềm mại, mang hơi hướng thực vật và vẫn giữ độ tin cậy của một sản phẩm nghiên cứu.

## Macrostructure family
- Marketing pages: Editorial Product Storyboard — hero là một khung cảnh thương hiệu, sau đó là các dải nội dung độc lập. Mỗi section trên Home chiếm một hàng riêng; không ghép hai section trong cùng wrapper và không để grid cha ép chiều cao hoặc chiều rộng nội dung con.
- Content pages: long-form có mục lục nhẹ, tiêu đề rõ và khoảng đọc thoáng.
- Form pages: tiêu đề ngắn, form chia nhóm, phản hồi trạng thái tại chỗ.

## Theme
- Bảng màu được lấy từ logo và bao bì: ivory ấm, blush pink/salmon, xanh olive–sage và mực nâu olive. Hồng ổi là màu hành động chính; sage dùng cho tiêu đề phụ và section thông tin.
- Màu và khoảng cách được khai báo trong `tokens.css`; không đặt màu trực tiếp trong component.

## Typography
- Display: Fraunces, 600–700, normal; bundle local với Vietnamese subset, dùng cho hero và tiêu đề section để tạo chất in ấn hữu cơ, thân thiện.
- Card heading: Fraunces, 700, normal; dùng ở kích thước vừa, tracking chặt và không dùng italic.
- Body: Be Vietnam Pro, 400–700; bundle local với Vietnamese subset.
- Tiêu đề dùng kích thước fluid và luôn cho phép ngắt từ dài.

## Card voice
- Card audience dùng cấu trúc botanical editorial: ảnh là mảng chính với bo góc hữu cơ bất đối xứng; caption nổi chồng nhẹ lên ảnh và đổi hướng trái/phải theo nhịp grid.
- Caption dùng Fraunces cho tên nhóm, Be Vietnam Pro cho mô tả, một nét màu ngắn lấy từ hồng ổi hoặc olive. Không mô phỏng gói kẹo, mép hàn, badge tròn hay sticker.
- Grid desktop dùng nhịp 7/5 rồi 5/7 thay vì bốn ô bằng nhau; mobile trở về một cột để bảo toàn ảnh và độ đọc.

## Editorial media sections
- Section lợi ích dùng ảnh đời thường làm mảng neo, đi cùng các ghi chú phân cách bằng hairline; không đóng từng lợi ích vào card, không dùng icon medallion hay nền hộp lặp lại.
- Section câu chuyện dùng bố cục split trên nền sage nhạt, ảnh vuông bo hữu cơ và tiêu đề Fraunces khổ lớn. Không mô phỏng viên kẹo hoặc bao bì bằng CSS.
- Ảnh có nội dung riêng được đưa vào `public/assets/fiuava/`, khai báo kích thước nội tại, tải trì hoãn và giữ crop có chủ ý theo từng section.
- Ảnh đời sống phải thống nhất ánh sáng tự nhiên, nền kem–gỗ sáng–sage và ngữ cảnh Việt Nam. Không dùng hình bác sĩ, mô hình nội tạng, nền xanh y khoa hoặc ảnh gia đình tạo dáng như quảng cáo bệnh lý.
- Bao bì GuavaFiber trong hero, journey và CTA chỉ dùng `product.png` hoặc `product-cutout.png`; ảnh tạo sinh không được vẽ lại logo hay nhãn bao bì. Ảnh tạo sinh chỉ cung cấp bối cảnh đời sống/nguyên liệu và được tối ưu WebP trước khi đưa vào trang.
- Home được phép dùng artwork tổng hợp do người dùng cung cấp cho hero và section dự án. Desktop hiển thị artwork theo đúng tỷ lệ gốc và bổ sung CTA bằng HTML; mobile dùng crop sản phẩm hoặc nội dung HTML tương đương để chữ không bị thu nhỏ đến mức khó đọc.

## Motion
- Các trang nội dung dùng reveal-on-scroll một lần bằng opacity + translateY; card dùng hover-lift nhẹ trên thiết bị có con trỏ chính xác.
- Chỉ dùng opacity và transform cho hover/menu/reveal.
- Tôn trọng `prefers-reduced-motion`.

## CTA voice
- Primary: nền hồng ổi, dạng pill, nhãn ngắn và luôn trên một dòng.
- Secondary: nền trong, viền mảnh.

## Navigation voice
- Desktop dùng navbar phẳng trên nền ivory: logo tách bên trái, liên kết chữ nhỏ viết hoa với khoảng cách rộng vừa phải và trạng thái active bằng gạch chân hồng.
- Chỉ CTA cuối thanh điều hướng dùng nền hồng ổi dạng pill; các tab điều hướng không dùng capsule hoặc nền tô riêng.
- Mobile giữ nút disclosure và panel một cột; trạng thái active dùng cùng ngôn ngữ gạch chân để nhất quán với desktop.

## What pages MUST share
- Logo GuavaFiber, header, footer, màu nhấn, typography, button và focus ring.
- Không sử dụng ảnh CordyDew; chỉ dùng logo, ảnh sản phẩm GuavaFiber hoặc placeholder trung tính.
- Ảnh sản phẩm tách nền xuất hiện trong hero của trang dẫn sản phẩm và trang hồ sơ sản phẩm; Home được phép lặp lại một lần trong CTA cuối để khép lại câu chuyện.

## Content patterns
- Home dùng đúng trục 11 phần: morning-scene hero; “Có những ngày…”; mở một viên; ba vòng giá trị; hành trình phần quả bị bỏ lại; thời điểm sử dụng; từ ý tưởng đến sản phẩm; quality desk; nhật ký dùng thử; mini-quiz nhịp sống; CTA phản hồi. Không quay lại các section “Điểm khác biệt”, audience theo nhóm bệnh/lối sống, testimonial ba card giống nhau hoặc giấy chứng nhận minh họa.
- Quality desk chỉ hiển thị tài liệu kiểm nghiệm thật. Khi chưa có tài liệu chính thức, nút phải ở trạng thái disabled và giải thích rõ lý do.
- Nhật ký dùng thử có thể dùng phản hồi do người dùng cung cấp nhưng không tự gán tên, avatar hoặc vai trò. Mini-quiz chỉ đưa gợi ý về nhịp sử dụng, không dùng ngôn ngữ chẩn đoán sức khỏe.
- Section “Có những ngày…” kết thúc ngay sau bốn khung tình huống, không thêm dải địa điểm sử dụng bên dưới. Fieldset của mini-quiz đặt legend thành một khối riêng bên trong bề mặt, và nhãn lựa chọn luôn giữ trên một dòng; nhóm lựa chọn được phép xuống hàng thay vì ép chữ.
- Trang Sản phẩm không lặp lại các section “Những điều thú vị”, câu chuyện bã ổi, nhóm người dùng hay phản hồi từ Home. Trang tập trung vào hero packshot, hồ sơ/thông số dạng ledger, ba lớp trải nghiệm, quy trình phát triển–sản xuất dạng timeline, các điểm kiểm soát và CTA liên hệ.
- Không dùng section “Hai phiên bản chuyên biệt” trên trang Sản phẩm. Các thông số chưa có kiểm nghiệm dùng nhãn trạng thái rõ ràng thay vì số liệu hoặc tuyên bố sức khỏe suy đoán.
- Trang Câu chuyện đặt đội ngũ phát triển ngay sau hero, trước khối “Chúng tôi là ai?”, sau đó mới đến câu chuyện hình thành, bốn trụ cột và bốn lớp giá trị.
- Nội dung liên quan sức khỏe dùng ngôn ngữ “hỗ trợ”, “định hướng” hoặc “mục tiêu phát triển” cho đến khi có dữ liệu kiểm nghiệm công bố.

## Responsive
- Hero CTA luôn nằm trong luồng tài liệu: mobile đặt sau phần giới thiệu, desktop dùng một dải riêng dưới artwork; không neo nút bằng tọa độ phần trăm trên ảnh có chữ.
- Audit responsive của Home bao phủ 320, 375, 414, 768, 1024, 1280 và 1440px.
- Mobile-first; kiểm soát tại 320, 375, 414 và 768px.
- Menu chuyển thành disclosure ở màn hình hẹp; mọi liên kết chính luôn trên một dòng.
- Khoảng cách section trên mobile dùng nhịp 4.5rem thay vì nhịp desktop 7rem; CTA trong form chiếm toàn chiều rộng ở màn hình hẹp.
- Ảnh chân dung thành viên dùng khung 4:5, có kích thước nội tại và tải trì hoãn để giảm CLS và dung lượng tải ban đầu.

## Exports

### CSS variables

Nguồn chính là `tokens.css` tại thư mục gốc.

### Tailwind v4 `@theme`

```css
@theme {
  --color-paper: oklch(98.2% 0.012 74);
  --color-paper-2: oklch(96.5% 0.026 55);
  --color-ink: oklch(35% 0.038 43);
  --color-accent: oklch(67% 0.155 16);
  --color-green: oklch(58% 0.09 102);
  --color-card-warm: oklch(95.5% 0.04 32);
  --color-card-botanical: oklch(95% 0.045 105);
  --font-display: 'Fraunces', Georgia, serif;
  --font-hero: 'Fraunces', Georgia, serif;
  --font-body: 'Be Vietnam Pro', Arial, sans-serif;
  --font-card: 'Fraunces', Georgia, serif;
  --spacing-md: 1.5rem;
  --radius-card: 1rem;
  --radius-organic-a: 2.5rem .75rem 2.75rem 1rem;
  --radius-organic-b: .75rem 2.5rem 1rem 2.75rem;
  --radius-pill: 999px;
}
```

### DTCG `tokens.json`

```json
{
  "color": {
    "paper": { "$value": "oklch(98.2% 0.012 74)", "$type": "color" },
    "ink": { "$value": "oklch(35% 0.038 43)", "$type": "color" },
    "accent": { "$value": "oklch(67% 0.155 16)", "$type": "color" },
    "green": { "$value": "oklch(58% 0.09 102)", "$type": "color" },
    "card-warm": { "$value": "oklch(95.5% 0.04 32)", "$type": "color" },
    "card-botanical": { "$value": "oklch(95% 0.045 105)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Fraunces, Georgia, serif", "$type": "fontFamily" },
    "hero": { "$value": "Fraunces, Georgia, serif", "$type": "fontFamily" },
    "card": { "$value": "Fraunces, Georgia, serif", "$type": "fontFamily" },
    "body": { "$value": "Be Vietnam Pro, Arial, sans-serif", "$type": "fontFamily" }
  },
  "space": { "md": { "$value": "1.5rem", "$type": "dimension" } }
}
```

### shadcn/ui CSS variables

```css
:root {
  --background: 98.2% 0.012 74;
  --foreground: 35% 0.038 43;
  --primary: 67% 0.155 16;
  --primary-foreground: 99% 0.006 75;
  --secondary: 93% 0.045 104;
  --border: 88% 0.035 50;
  --ring: 58% 0.09 102;
  --radius: 1rem;
}
```
