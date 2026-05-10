import { MigrationInterface, QueryRunner } from 'typeorm';

async function columnExists(
  queryRunner: QueryRunner,
  table: string,
  column: string,
): Promise<boolean> {
  const rows: { c: number }[] = await queryRunner.query(
    `SELECT COUNT(*) AS c FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column],
  );
  return rows[0].c > 0;
}

async function tableExists(
  queryRunner: QueryRunner,
  table: string,
): Promise<boolean> {
  const rows: { c: number }[] = await queryRunner.query(
    `SELECT COUNT(*) AS c FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [table],
  );
  return rows[0].c > 0;
}

export class RoomFeesMeterBilling1739127200000 implements MigrationInterface {
  name = 'RoomFeesMeterBilling1739127200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await columnExists(queryRunner, 'rooms', 'floor')) {
      await queryRunner.query(`ALTER TABLE rooms DROP COLUMN floor`);
    }
    if (await columnExists(queryRunner, 'rooms', 'area_m2')) {
      await queryRunner.query(`ALTER TABLE rooms DROP COLUMN area_m2`);
    }
    if (!(await columnExists(queryRunner, 'rooms', 'internet_fee_monthly'))) {
      await queryRunner.query(`
        ALTER TABLE rooms
          ADD COLUMN internet_fee_monthly DECIMAL(12,2) NULL AFTER deposit_amount,
          ADD COLUMN service_fee_monthly DECIMAL(12,2) NULL AFTER internet_fee_monthly
      `);
    }

    if (!(await tableExists(queryRunner, 'meter_readings'))) {
      await queryRunner.query(`
        CREATE TABLE meter_readings (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          contract_id BIGINT UNSIGNED NOT NULL,
          utility_type ENUM('electricity', 'water') NOT NULL,
          reading_at DATE NOT NULL,
          index_value DECIMAL(14,4) NOT NULL,
          photo_url VARCHAR(512) NULL,
          notes TEXT NULL,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          INDEX IDX_meter_contract_type_date (contract_id, utility_type, reading_at),
          CONSTRAINT fk_meter_contract FOREIGN KEY (contract_id) REFERENCES contracts (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    }

    if (!(await tableExists(queryRunner, 'billing_periods'))) {
      await queryRunner.query(`
        CREATE TABLE billing_periods (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          contract_id BIGINT UNSIGNED NOT NULL,
          period_year SMALLINT UNSIGNED NOT NULL,
          period_month TINYINT UNSIGNED NOT NULL,
          electricity_prev_index DECIMAL(14,4) NULL,
          electricity_curr_index DECIMAL(14,4) NULL,
          electricity_unit_price DECIMAL(12,4) NULL,
          electricity_amount DECIMAL(12,2) NULL,
          water_prev_index DECIMAL(14,4) NULL,
          water_curr_index DECIMAL(14,4) NULL,
          water_unit_price DECIMAL(12,4) NULL,
          water_amount DECIMAL(12,2) NULL,
          internet_fee DECIMAL(12,2) NULL,
          service_fee DECIMAL(12,2) NULL,
          rent_amount DECIMAL(12,2) NULL,
          total_due DECIMAL(12,2) NULL,
          status ENUM('draft', 'finalized', 'paid') NOT NULL DEFAULT 'draft',
          finalized_at DATETIME NULL,
          created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          PRIMARY KEY (id),
          UNIQUE KEY uq_billing_contract_period (contract_id, period_year, period_month),
          CONSTRAINT fk_billing_contract FOREIGN KEY (contract_id) REFERENCES contracts (id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await tableExists(queryRunner, 'billing_periods')) {
      await queryRunner.query(`DROP TABLE billing_periods`);
    }
    if (await tableExists(queryRunner, 'meter_readings')) {
      await queryRunner.query(`DROP TABLE meter_readings`);
    }
    if (await columnExists(queryRunner, 'rooms', 'internet_fee_monthly')) {
      await queryRunner.query(
        `ALTER TABLE rooms DROP COLUMN internet_fee_monthly`,
      );
    }
    if (await columnExists(queryRunner, 'rooms', 'service_fee_monthly')) {
      await queryRunner.query(
        `ALTER TABLE rooms DROP COLUMN service_fee_monthly`,
      );
    }
    if (!(await columnExists(queryRunner, 'rooms', 'floor'))) {
      await queryRunner.query(
        `ALTER TABLE rooms ADD COLUMN floor INT NULL AFTER room_code`,
      );
    }
    if (!(await columnExists(queryRunner, 'rooms', 'area_m2'))) {
      await queryRunner.query(`
        ALTER TABLE rooms ADD COLUMN area_m2 DECIMAL(8,2) NULL AFTER floor
      `);
    }
  }
}
