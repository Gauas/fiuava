# Kết nối biểu mẫu Fiuava với Google Sheet

## 1. Tạo Google Sheet và Apps Script

1. Tạo một Google Sheet mới.
2. Trong Sheet, mở **Extensions → Apps Script**.
3. Thay nội dung `Code.gs` bằng file `google-apps-script/Code.gs` trong dự án.
4. Nếu dùng token, mở **Project Settings → Script properties**, thêm:
   - Property: `FIUAVA_FORM_TOKEN`
   - Value: chuỗi giống `VITE_GOOGLE_SHEETS_TOKEN`.

## 2. Deploy Web App

1. Chọn **Deploy → New deployment → Web app**.
2. **Execute as:** Me.
3. **Who has access:** Anyone.
4. Deploy, cấp quyền và sao chép URL kết thúc bằng `/exec`.

Khi sửa Apps Script, tạo **New version** trong **Manage deployments**; chỉ Save code sẽ không cập nhật bản đang chạy.

## 3. Cấu hình website

Sao chép `.env.example` thành `.env.local`, sau đó điền:

```env
VITE_GOOGLE_SHEETS_ENDPOINT=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
VITE_GOOGLE_SHEETS_TOKEN=your-validation-token
```

Khởi động lại Vite sau khi đổi env:

```bash
npm run dev
```

Khi deploy hosting, khai báo hai biến `VITE_...` trong phần Environment Variables rồi build lại.

## 4. Kiểm tra

- Gửi thử trang `/survey/`: dữ liệu xuất hiện trong sheet `Khao sat`.
- Gửi thử trang `/contact/`: dữ liệu xuất hiện trong sheet `Lien he`.
- Hai sheet con và hàng tiêu đề được tạo tự động ở lần gửi đầu tiên.

`VITE_` là biến phía trình duyệt nên không chứa thông tin bí mật. Token ở đây chỉ giúp lọc request không đúng cấu trúc; không thay thế CAPTCHA hoặc một backend có xác thực.

