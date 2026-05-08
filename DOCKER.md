# MySQL (Docker) + NestJS

## Chạy cả DB và API (Docker Compose)

Từ thư mục project:

```bash
docker compose up --build
```

Hoặc nền: `docker compose up -d --build`

- **MySQL:** port `3306`, database `hostel`
- **API:** port `3000` (http://localhost:3000)

Service `api` chỉ start sau khi MySQL **healthy** (`mysqladmin ping`).

Dừng: `docker compose down` (thêm `-v` nếu muốn xóa volume dữ liệu MySQL).

## Chạy Nest trên máy, chỉ DB trong Docker

1. Copy [`.env.example`](./.env.example) → `.env` (`DB_HOST=127.0.0.1`).
2. Để test nhanh schema ở local, giữ **`TYPEORM_SYNC=true`** trong `.env` (TypeORM tự tạo/cập nhật bảng từ entity). **Tắt** trước khi lên production; image `api` trong Compose luôn đặt `TYPEORM_SYNC=false`.
3. Chỉ chạy DB: `docker compose up -d mysql`
4. `npm install` và `npm run start:dev`

Sau khi chạy, kiểm tra DB `hostel` — các bảng từ entity trong `src/entities/` (ví dụ `users`, `properties`, `contracts`, …).

Nếu trước đó đã có bảng `users` cũ (ít cột), `TYPEORM_SYNC` có thể lỗi khi đổi schema: xóa volume MySQL (`docker compose down -v`) hoặc drop database `hostel` rồi chạy lại.

## Migration seed (dữ liệu mẫu)

1. Bảng phải đã tồn tại (bật `TYPEORM_SYNC=true` chạy app một lần, **hoặc** tạo schema bằng migration riêng).
2. Có thể tắt sync (`TYPEORM_SYNC=false`) rồi chỉ dùng migration.
3. Chạy: `npm install` rồi `npm run migration:run`

Dữ liệu demo: quận/ phường mã `HCMC-Q1-DEMO`, chủ `owner@demo.local`, người thuê `tenant@demo.local`, mật khẩu **`Test@1234`**, hợp đồng `HD-DEMO-001`.

Hoàn tác: `npm run migration:revert`
