import { MigrationInterface, QueryRunner } from 'typeorm';

/** Drop every FK on contract_occupants (names differ: migration vs TypeORM sync). */
async function dropContractOccupantForeignKeys(
  queryRunner: QueryRunner,
): Promise<void> {
  const rows: { CONSTRAINT_NAME: string }[] = await queryRunner.query(`
    SELECT CONSTRAINT_NAME
    FROM information_schema.TABLE_CONSTRAINTS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'contract_occupants'
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
  `);
  for (const { CONSTRAINT_NAME } of rows) {
    await queryRunner.query(
      `ALTER TABLE contract_occupants DROP FOREIGN KEY \`${CONSTRAINT_NAME}\``,
    );
  }
}

export class ContractOccupantOptionalUser1739127000000
  implements MigrationInterface
{
  name = 'ContractOccupantOptionalUser1739127000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await dropContractOccupantForeignKeys(queryRunner);
    await queryRunner.query(
      `ALTER TABLE contract_occupants DROP INDEX uq_contract_occupant_user`,
    );
    await queryRunner.query(
      `ALTER TABLE contract_occupants MODIFY user_id BIGINT UNSIGNED NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE contract_occupants
        ADD COLUMN display_full_name VARCHAR(255) NULL AFTER user_id,
        ADD COLUMN contact_phone VARCHAR(32) NULL AFTER display_full_name,
        ADD COLUMN contact_email VARCHAR(255) NULL AFTER contact_phone
    `);
    await queryRunner.query(
      `ALTER TABLE contract_occupants ADD CONSTRAINT fk_co_contract FOREIGN KEY (contract_id) REFERENCES contracts (id) ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE contract_occupants ADD CONSTRAINT fk_co_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM contract_occupants WHERE user_id IS NULL`,
    );
    await dropContractOccupantForeignKeys(queryRunner);
    await queryRunner.query(
      `ALTER TABLE contract_occupants DROP COLUMN contact_email`,
    );
    await queryRunner.query(
      `ALTER TABLE contract_occupants DROP COLUMN contact_phone`,
    );
    await queryRunner.query(
      `ALTER TABLE contract_occupants DROP COLUMN display_full_name`,
    );
    await queryRunner.query(
      `ALTER TABLE contract_occupants MODIFY user_id BIGINT UNSIGNED NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE contract_occupants ADD UNIQUE KEY uq_contract_occupant_user (contract_id, user_id)`,
    );
    await queryRunner.query(
      `ALTER TABLE contract_occupants ADD CONSTRAINT fk_co_contract FOREIGN KEY (contract_id) REFERENCES contracts (id) ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE contract_occupants ADD CONSTRAINT fk_co_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE`,
    );
  }
}
