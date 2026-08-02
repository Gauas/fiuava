# Design — Fiuava

Hệ thống thiết kế thống nhất cho website đa trang Fiuava, được điều chỉnh theo ảnh thiết kế do người dùng cung cấp và nhận diện thật của sản phẩm.

## Genre
Playful có tiết chế: thân thiện, mềm mại, mang hơi hướng thực vật và vẫn giữ độ tin cậy của một sản phẩm nghiên cứu.

## Macrostructure family
- Marketing pages: Product Narrative — hero lệch trái có sản phẩm lớn, dải lợi ích giao với hero, câu chuyện thương hiệu, sản phẩm và CTA.
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

## Motion
- Các trang nội dung dùng reveal-on-scroll một lần bằng opacity + translateY; card dùng hover-lift nhẹ trên thiết bị có con trỏ chính xác.
- Chỉ dùng opacity và transform cho hover/menu/reveal.
- Tôn trọng `prefers-reduced-motion`.

## CTA voice
- Primary: nền hồng ổi, dạng pill, nhãn ngắn và luôn trên một dòng.
- Secondary: nền trong, viền mảnh.

## What pages MUST share
- Logo Fiuava, header, footer, màu nhấn, typography, button và focus ring.
- Không sử dụng ảnh CordyDew; chỉ dùng logo, ảnh sản phẩm Fiuava hoặc placeholder trung tính.
- Ảnh sản phẩm tách nền chỉ xuất hiện một lần trong hero homepage; các vị trí chưa có ảnh riêng phải dùng placeholder có nhãn.

## Content patterns
- Trang Sản phẩm dùng phần giới thiệu chia đôi, hai thẻ dòng sản phẩm, quy trình 6 bước và dải đặc tính thiết kế.
- Trang Câu chuyện đặt đội ngũ phát triển ngay sau hero, trước khối “Chúng tôi là ai?”, sau đó mới đến câu chuyện hình thành, bốn trụ cột và bốn lớp giá trị.
- Nội dung liên quan sức khỏe dùng ngôn ngữ “hỗ trợ”, “định hướng” hoặc “mục tiêu phát triển” cho đến khi có dữ liệu kiểm nghiệm công bố.

## Responsive
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
