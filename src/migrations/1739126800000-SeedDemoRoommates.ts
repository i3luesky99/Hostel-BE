import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

/** Bổ sung 2 tenant ở cùng phòng DEMO (DB đã chạy seed cũ trước khi có roommates). */
const CONTRACT_NO = 'HD-DEMO-001';
const ROOM_CODE = 'DEMO-101';
const TENANT2_EMAIL = 'tenant2@demo.local';
const TENANT3_EMAIL = 'tenant3@demo.local';
const CITIZEN_ID_2 = '079099014102';
const CITIZEN_ID_3 = '079099014103';

export class SeedDemoRoommates1739126800000 implements MigrationInterface {
  name = 'SeedDemoRoommates1739126800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const contractRows = await queryRunner.query(
      `SELECT id, room_id FROM contracts WHERE contract_no = ? LIMIT 1`,
      [CONTRACT_NO],
    );
    if (!contractRows.length) return;

    const dup = await queryRunner.query(
      `SELECT id FROM users WHERE email IN (?, ?) LIMIT 1`,
      [TENANT2_EMAIL, TENANT3_EMAIL],
    );
    if (dup.length > 0) return;

    const passwordHash = await bcrypt.hash('Test@1234', 10);
    const contractId = contractRows[0].id;
    const roomId = contractRows[0].room_id;

    await queryRunner.query(
      `UPDATE rooms SET max_occupancy = 3, status = 'occupied' WHERE id = ?`,
      [roomId],
    );

    await queryRunner.query(
      `INSERT INTO users (email, password_hash, full_name, phone, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'active', NOW(), NOW()), (?, ?, ?, ?, 'active', NOW(), NOW())`,
      [
        TENANT2_EMAIL,
        passwordHash,
        'Người thuê cùng Demo 2',
        '0909000003',
        TENANT3_EMAIL,
        passwordHash,
        'Người thuê cùng Demo 3',
        '0909000004',
      ],
    );

    const [t2] = await queryRunner.query(
      `SELECT id FROM users WHERE email = ?`,
      [TENANT2_EMAIL],
    );
    const [t3] = await queryRunner.query(
      `SELECT id FROM users WHERE email = ?`,
      [TENANT3_EMAIL],
    );

    await queryRunner.query(
      `INSERT INTO user_roles (user_id, role) VALUES (?, 'tenant'), (?, 'tenant')`,
      [t2.id, t3.id],
    );

    await queryRunner.query(
      `INSERT INTO tenant_profiles (user_id, photo_url, citizen_id, citizen_id_issue_date, citizen_id_issue_place, citizen_id_front_url, citizen_id_back_url, created_at, updated_at)
       VALUES (?, NULL, ?, '2016-01-01', 'Cục CS QLHC về TTXH', NULL, NULL, NOW(), NOW()),
             (?, NULL, ?, '2017-03-15', 'Cục CS QLHC về TTXH', NULL, NULL, NOW(), NOW())`,
      [t2.id, CITIZEN_ID_2, t3.id, CITIZEN_ID_3],
    );

    await queryRunner.query(
      `INSERT INTO contract_occupants (contract_id, user_id) VALUES (?, ?), (?, ?)`,
      [contractId, t2.id, contractId, t3.id],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await queryRunner.query(
      `DELETE FROM tenant_profiles WHERE citizen_id IN (?, ?)`,
      [CITIZEN_ID_2, CITIZEN_ID_3],
    );
    await queryRunner.query(
      `DELETE ur FROM user_roles ur INNER JOIN users u ON u.id = ur.user_id WHERE u.email IN (?, ?)`,
      [TENANT2_EMAIL, TENANT3_EMAIL],
    );
    await queryRunner.query(`DELETE FROM users WHERE email IN (?, ?)`, [
      TENANT2_EMAIL,
      TENANT3_EMAIL,
    ]);
    await queryRunner.query(
      `UPDATE rooms SET max_occupancy = 2, status = 'available' WHERE room_code = ?`,
      [ROOM_CODE],
    );
    await queryRunner.query(`SET FOREIGN_KEY_CHECKS = 1`);
  }
}
