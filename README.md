# Hostel (BE)

API NestJS quản lý nhà trọ / phòng cho thuê (MySQL). Database mặc định tên **`hostel`**.

## Yêu cầu

- **Node.js** 18+ (khuyến nghị LTS) và **npm**
- **Docker Desktop** (tùy chọn, để chạy MySQL hoặc full stack)
- **Git**

Nếu terminal báo `npm` không nhận: cài [Node.js LTS](https://nodejs.org), đóng mở lại terminal/Cursor, hoặc thêm `C:\Program Files\nodejs\` vào biến môi trường **Path**.

## Cài đặt nhanh

```bash
git clone <repo-url> hostel
cd hostel
cp .env.example .env
# Chỉnh .env nếu MySQL không chạy mặc định localhost:3306
npm install
```

## Chạy MySQL bằng Docker

**Khuyến nghị khi dev (nhanh, không build image API mỗi lần sửa code):** chỉ database, Nest chạy trên máy (`npm run start:dev`):

```bash
docker compose up -d mysql
```

(`docker compose up -d` mặc định cũng chỉ khởi động MySQL; API trong Docker cần profile `api` — xem [DOCKER.md](./DOCKER.md).)

Thông tin kết nối mặc định (trùng `.env.example`):

| Thông số   | Giá trị     |
|------------|-------------|
| Host       | `127.0.0.1` |
| Port       | `3306`      |
| Database   | `hostel`    |
| User       | `hostel`    |
| Password   | `hostel_dev`|

Dừng DB: `docker compose down` — thêm `-v` nếu muốn **xóa hết dữ liệu** volume MySQL.

Chi tiết chạy cả **API + MySQL** trong Docker: xem [DOCKER.md](./DOCKER.md).

## Migration (schema + dữ liệu mẫu)

Sau khi MySQL đã chạy và file `.env` đúng:

```bash
npm run migration:run
```

Lệnh này chạy lần lượt:

1. **Init schema** — tạo/cập nhật bảng theo entity TypeORM.
2. **Seed demo** — chèn dữ liệu test (nếu đã có mã `HCMC-Q1-DEMO` thì bỏ qua phần seed).

Hoàn tác migration cuối: `npm run migration:revert` (có thể cần chạy nhiều lần để revert từng bước).

Xem trạng thái: `npm run migration:show`

## Chạy API (development)

```bash
npm run start:dev
```

- Mặc định: **http://localhost:3000**
- **Swagger UI:** **http://localhost:3000/docs** (OpenAPI, thử API trực tiếp trên trình duyệt)
- `GET /` — kiểm tra API còn sống (`Hello World!`)

### REST CRUD (tiền tố `/`, ví dụ `GET /districts`)

| Nhóm | Đường dẫn gốc |
|------|------------------|
| Quận/huyện | `/districts` |
| Phường/xã | `/wards` (query `?districtId=`) |
| Người dùng | `/users` (không trả `password_hash`) |
| Role user | `/user-roles` (query `?userId=`) |
| Hồ sơ người thuê | `/tenant-profiles` (khóa chính = `userId` trong URL) |
| Cơ sở / dãy trọ | `/properties` (query `?ownerId=`) |
| Phòng | `/rooms` (query `?propertyId=`; ảnh trong body `photos` khi POST/PATCH) |
| Hợp đồng | `/contracts` |

Mỗi nhóm hỗ trợ chuẩn **GET (list + :id), POST, PATCH/:id, DELETE/:id** (trừ khi ghi chú khác). Id kiểu `bigint` dùng chuỗi số (vd `1`, `2`).

### Biến môi trường quan trọng

| Biến           | Ý nghĩa |
|----------------|---------|
| `DB_HOST`      | MySQL host (`127.0.0.1` khi DB map port ra máy) |
| `DB_PORT`      | Cổng MySQL (thường `3306`) |
| `DB_USERNAME` / `DB_PASSWORD` / `DB_DATABASE` | Tài khoản & tên DB |
| `TYPEORM_SYNC` | `true` / `false` — đồng bộ schema khi app khởi động (**chỉ nên bật local**). Khi đã dùng migration tạo bảng, có thể đặt `false` để tránh drift. |
| `PORT`         | Cổng HTTP (mặc định `3000`) |

## Tài khoản demo (sau `migration:run`)

| Vai trò      | Email               | Mật khẩu   |
|-------------|---------------------|------------|
| Chủ trọ     | `owner@demo.local`  | `Test@1234` |
| Người thuê  | `tenant@demo.local` | `Test@1234` |

Hợp đồng mẫu: `HD-DEMO-001`. Dữ liệu địa lý demo dùng mã quận `HCMC-Q1-DEMO`.

## Script npm thường dùng

| Script            | Mô tả |
|-------------------|--------|
| `npm run start:dev` | API + watch |
| `npm run build`     | Build production (`dist/`) |
| `npm run start:prod` | Chạy `node dist/main` (cần build trước) |
| `npm run lint`      | ESLint |
| `npm test`          | Unit test |

## Docker Desktop (Windows)

Nếu Docker báo **WSL cần cập nhật**: mở PowerShell **Administrator**, chạy `wsl --update`, khởi động lại máy, mở lại Docker Desktop. Xem thêm [tài liệu WSL](https://aka.ms/wslinstall).

## Tài liệu thêm

- [DOCKER.md](./DOCKER.md) — Compose, sync, migration, reset volume.
- [docs/mysql-schema.png](./docs/mysql-schema.png) — sơ đồ bảng (minh họa).

## License

Private / UNLICENSED (theo `package.json`).
