import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Creates/updates tables from registered TypeORM entities (same as app synchronize).
 * Run before seed migration when DB has no tables yet. Safe to re-run on existing DB.
 */
export class InitSchemaFromEntities1739126000000 implements MigrationInterface {
  name = 'InitSchemaFromEntities1739126000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.synchronize();
  }

  public async down(): Promise<void> {
    // No-op: dropping the whole schema is unsafe here; reset DB manually if needed.
  }
}
