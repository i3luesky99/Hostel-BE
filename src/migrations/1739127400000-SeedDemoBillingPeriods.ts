import { MigrationInterface, QueryRunner } from 'typeorm';

const CONTRACT_NO = 'HD-DEMO-001';

/**
 * Hai kỳ liên tiếp để so sánh tiêu thụ / tổng tiền (demo).
 * Tháng 4/2026 và 5/2026 — INSERT IGNORE để không lỗi khi đã có một trong hai kỳ.
 */
export class SeedDemoBillingPeriods1739127400000 implements MigrationInterface {
  name = 'SeedDemoBillingPeriods1739127400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const contracts = await queryRunner.query(
      `SELECT id FROM contracts WHERE contract_no = ? LIMIT 1`,
      [CONTRACT_NO],
    );
    if (!contracts.length) return;

    const contractId = contracts[0].id;

    await queryRunner.query(
      `
      INSERT IGNORE INTO billing_periods (
        contract_id,
        period_year,
        period_month,
        electricity_prev_index,
        electricity_curr_index,
        electricity_unit_price,
        electricity_amount,
        water_prev_index,
        water_curr_index,
        water_unit_price,
        water_amount,
        internet_fee,
        service_fee,
        rent_amount,
        total_due,
        status,
        finalized_at,
        created_at,
        updated_at
      ) VALUES
      (
        ?,
        2026,
        4,
        10000.0000,
        10180.0000,
        3000.0000,
        540000.00,
        50.0000,
        62.0000,
        25000.0000,
        300000.00,
        100000.00,
        50000.00,
        3500000.00,
        4490000.00,
        'paid',
        '2026-05-01 10:00:00',
        NOW(6),
        NOW(6)
      ),
      (
        ?,
        2026,
        5,
        10180.0000,
        10355.0000,
        3000.0000,
        525000.00,
        62.0000,
        71.5000,
        25000.0000,
        237500.00,
        100000.00,
        50000.00,
        3500000.00,
        4412500.00,
        'finalized',
        '2026-06-01 09:30:00',
        NOW(6),
        NOW(6)
      )
      `,
      [contractId, contractId],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DELETE bp FROM billing_periods bp
      INNER JOIN contracts c ON c.id = bp.contract_id
      WHERE c.contract_no = ?
        AND bp.period_year = 2026
        AND bp.period_month IN (4, 5)
      `,
      [CONTRACT_NO],
    );
  }
}
