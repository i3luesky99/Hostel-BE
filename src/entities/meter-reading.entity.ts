import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contract } from './contract.entity';
import { UtilityType } from './enums';

@Entity('meter_readings')
@Index(['contract', 'utilityType', 'readingAt'])
export class MeterReading {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => Contract, (c) => c.meterReadings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @Column({
    name: 'utility_type',
    type: 'enum',
    enum: UtilityType,
  })
  utilityType: UtilityType;

  /** Ngày ghi nhận chỉ số (thường cuối kỳ). */
  @Column({ name: 'reading_at', type: 'date' })
  readingAt: string;

  /** Số trên đồng hồ (kWh hoặc m³ tuỳ loại). */
  @Column({
    name: 'index_value',
    type: 'decimal',
    precision: 14,
    scale: 4,
  })
  indexValue: string;

  @Column({
    name: 'photo_url',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  photoUrl: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
