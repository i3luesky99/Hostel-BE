import { MigrationInterface, QueryRunner } from 'typeorm';

/** Seed cũ có thể đã chèn phòng trước khi có cột phí — bổ sung giá demo cho DEMO-101. */
export class BackfillDemoRoomFees1739127300000 implements MigrationInterface {
  name = 'BackfillDemoRoomFees1739127300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE rooms
      SET
        internet_fee_monthly = COALESCE(internet_fee_monthly, 100000.00),
        service_fee_monthly = COALESCE(service_fee_monthly, 50000.00)
      WHERE room_code = 'DEMO-101'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE rooms
      SET internet_fee_monthly = NULL, service_fee_monthly = NULL
      WHERE room_code = 'DEMO-101'
        AND internet_fee_monthly = 100000.00
        AND service_fee_monthly = 50000.00
    `);
  }
}
