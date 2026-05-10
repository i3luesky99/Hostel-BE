import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from './contract.entity';
import { BillingPeriodStatus } from './enums';

@Entity('billing_periods')
@Unique('uq_billing_contract_period', ['contract', 'periodYear', 'periodMonth'])
export class BillingPeriod {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => Contract, (c) => c.billingPeriods, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @Column({ name: 'period_year', type: 'smallint', unsigned: true })
  periodYear: number;

  @Column({ name: 'period_month', type: 'tinyint', unsigned: true })
  periodMonth: number;

  @Column({
    name: 'electricity_prev_index',
    type: 'decimal',
    precision: 14,
    scale: 4,
    nullable: true,
  })
  electricityPrevIndex: string | null;

  @Column({
    name: 'electricity_curr_index',
    type: 'decimal',
    precision: 14,
    scale: 4,
    nullable: true,
  })
  electricityCurrIndex: string | null;

  @Column({
    name: 'electricity_unit_price',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
  })
  electricityUnitPrice: string | null;

  @Column({
    name: 'electricity_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  electricityAmount: string | null;

  @Column({
    name: 'water_prev_index',
    type: 'decimal',
    precision: 14,
    scale: 4,
    nullable: true,
  })
  waterPrevIndex: string | null;

  @Column({
    name: 'water_curr_index',
    type: 'decimal',
    precision: 14,
    scale: 4,
    nullable: true,
  })
  waterCurrIndex: string | null;

  @Column({
    name: 'water_unit_price',
    type: 'decimal',
    precision: 12,
    scale: 4,
    nullable: true,
  })
  waterUnitPrice: string | null;

  @Column({
    name: 'water_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  waterAmount: string | null;

  @Column({
    name: 'internet_fee',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  internetFee: string | null;

  @Column({
    name: 'service_fee',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  serviceFee: string | null;

  /** Snapshot tiền thuê nhà kỳ này (theo hợp đồng). */
  @Column({
    name: 'rent_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  rentAmount: string | null;

  @Column({
    name: 'total_due',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  totalDue: string | null;

  @Column({
    type: 'enum',
    enum: BillingPeriodStatus,
    default: BillingPeriodStatus.DRAFT,
  })
  status: BillingPeriodStatus;

  @Column({ name: 'finalized_at', type: 'datetime', nullable: true })
  finalizedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
