import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractOccupants1739126600000 implements MigrationInterface {
  name = 'AddContractOccupants1739126600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS contract_occupants (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        contract_id BIGINT UNSIGNED NOT NULL,
        user_id BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY uq_contract_occupant_user (contract_id, user_id),
        CONSTRAINT fk_co_contract FOREIGN KEY (contract_id) REFERENCES contracts (id) ON DELETE CASCADE,
        CONSTRAINT fk_co_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS contract_occupants`);
  }
}
