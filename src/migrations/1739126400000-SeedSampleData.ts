import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

const DISTRICT_CODE = 'HCMC-Q1-DEMO';
const OWNER_EMAIL = 'owner@demo.local';
const TENANT_EMAIL = 'tenant@demo.local';
const PROPERTY_NAME = 'Dãy trọ Demo Bến Nghé';
const ROOM_CODE = 'DEMO-101';
const CONTRACT_NO = 'HD-DEMO-001';
const CITIZEN_ID = '079099014101';

export class SeedSampleData1739126400000 implements MigrationInterface {
  name = 'SeedSampleData1739126400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const existing = await queryRunner.query(
      `SELECT id FROM districts WHERE code = ? LIMIT 1`,
      [DISTRICT_CODE],
    );
    if (existing.length > 0) {
      return;
    }

    const passwordHash = await bcrypt.hash('Test@1234', 10);

    await queryRunner.query(
      `INSERT INTO districts (code, name, type) VALUES (?, ?, ?)`,
      [DISTRICT_CODE, 'Quận 1 (demo)', 'urban_district'],
    );
    const [districtRow] = await queryRunner.query(
      `SELECT id FROM districts WHERE code = ?`,
      [DISTRICT_CODE],
    );
    const districtId = districtRow.id;

    await queryRunner.query(
      `INSERT INTO wards (district_id, name) VALUES (?, ?)`,
      [districtId, 'Phường Bến Nghé (demo)'],
    );
    const [wardRow] = await queryRunner.query(
      `SELECT id FROM wards WHERE district_id = ? ORDER BY id DESC LIMIT 1`,
      [districtId],
    );
    const wardId = wardRow.id;

    await queryRunner.query(
      `INSERT INTO users (email, password_hash, full_name, phone, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'active', NOW(), NOW())`,
      [OWNER_EMAIL, passwordHash, 'Chủ trọ Demo', '0909000001'],
    );
    await queryRunner.query(
      `INSERT INTO users (email, password_hash, full_name, phone, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'active', NOW(), NOW())`,
      [TENANT_EMAIL, passwordHash, 'Người thuê Demo', '0909000002'],
    );

    const [ownerRow] = await queryRunner.query(
      `SELECT id FROM users WHERE email = ?`,
      [OWNER_EMAIL],
    );
    const [tenantRow] = await queryRunner.query(
      `SELECT id FROM users WHERE email = ?`,
      [TENANT_EMAIL],
    );
    const ownerId = ownerRow.id;
    const tenantId = tenantRow.id;

    await queryRunner.query(
      `INSERT INTO user_roles (user_id, role) VALUES (?, 'owner'), (?, 'tenant')`,
      [ownerId, tenantId],
    );

    await queryRunner.query(
      `INSERT INTO properties (owner_id, name, address_line, district_id, ward_id, lat, lng, description, created_at)
       VALUES (?, ?, ?, ?, ?, 10.776889, 106.700806, ?, NOW())`,
      [
        ownerId,
        PROPERTY_NAME,
        '123 Đường Demo, Quận 1',
        districtId,
        wardId,
        'Nhà trọ mẫu để test API',
      ],
    );
    const [propRow] = await queryRunner.query(
      `SELECT id FROM properties WHERE name = ? LIMIT 1`,
      [PROPERTY_NAME],
    );
    const propertyId = propRow.id;

    await queryRunner.query(
      `INSERT INTO rooms (property_id, room_code, floor, area_m2, max_occupancy, amenities, status, monthly_rent, deposit_amount)
       VALUES (?, ?, 3, 18.50, 2, ?, 'available', 3500000.00, 7000000.00)`,
      [
        propertyId,
        ROOM_CODE,
        JSON.stringify({ mayLanh: true, nongLanh: true }),
      ],
    );
    const [roomRow] = await queryRunner.query(
      `SELECT id FROM rooms WHERE room_code = ? AND property_id = ?`,
      [ROOM_CODE, propertyId],
    );
    const roomId = roomRow.id;

    await queryRunner.query(
      `INSERT INTO room_photos (room_id, url, sort_order, is_cover)
       VALUES (?, ?, 0, true)`,
      [roomId, 'https://example.com/demo/room-cover.jpg'],
    );

    await queryRunner.query(
      `INSERT INTO tenant_profiles (user_id, photo_url, citizen_id, citizen_id_issue_date, citizen_id_issue_place, citizen_id_front_url, citizen_id_back_url, created_at, updated_at)
       VALUES (?, ?, ?, '2015-06-01', 'Cục CS QLHC về TTXH', NULL, NULL, NOW(), NOW())`,
      [tenantId, 'https://example.com/demo/tenant.jpg', CITIZEN_ID],
    );

    await queryRunner.query(
      `INSERT INTO contracts (room_id, tenant_user_id, owner_user_id, contract_no, start_date, end_date, monthly_rent, deposit_amount, status, signed_at, document_url, termination_reason, created_at)
       VALUES (?, ?, ?, ?, '2025-01-01', '2025-12-31', 3500000.00, 7000000.00, 'active', NOW(), NULL, NULL, NOW())`,
      [roomId, tenantId, ownerId, CONTRACT_NO],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await queryRunner.query(`DELETE FROM contracts WHERE contract_no = ?`, [
      CONTRACT_NO,
    ]);
    const rooms = await queryRunner.query(
      `SELECT id FROM rooms WHERE room_code = ?`,
      [ROOM_CODE],
    );
    for (const row of rooms as { id: string }[]) {
      await queryRunner.query(`DELETE FROM room_photos WHERE room_id = ?`, [
        row.id,
      ]);
    }
    await queryRunner.query(`DELETE FROM rooms WHERE room_code = ?`, [
      ROOM_CODE,
    ]);
    await queryRunner.query(`DELETE FROM properties WHERE name = ?`, [
      PROPERTY_NAME,
    ]);
    await queryRunner.query(
      `DELETE FROM tenant_profiles WHERE citizen_id = ?`,
      [CITIZEN_ID],
    );
    await queryRunner.query(
      `DELETE ur FROM user_roles ur INNER JOIN users u ON u.id = ur.user_id WHERE u.email IN (?, ?)`,
      [OWNER_EMAIL, TENANT_EMAIL],
    );
    await queryRunner.query(`DELETE FROM users WHERE email IN (?, ?)`, [
      OWNER_EMAIL,
      TENANT_EMAIL,
    ]);
    await queryRunner.query(
      `DELETE w FROM wards w INNER JOIN districts d ON d.id = w.district_id WHERE d.code = ?`,
      [DISTRICT_CODE],
    );
    await queryRunner.query(`DELETE FROM districts WHERE code = ?`, [
      DISTRICT_CODE,
    ]);
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);
  }
}
