import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractStatus } from './enums';
import { Room } from './room.entity';
import { User } from './user.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => Room, (r) => r.contracts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, (u) => u.tenantContracts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tenant_user_id' })
  tenant: User;

  @ManyToOne(() => User, (u) => u.ownerContracts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'owner_user_id' })
  owner: User;

  @Column({ name: 'contract_no', unique: true, length: 64 })
  contractNo: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: string | null;

  @Column({
    name: 'monthly_rent',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  monthlyRent: string;

  @Column({
    name: 'deposit_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  depositAmount: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  status: ContractStatus;

  @Column({ name: 'signed_at', type: 'datetime', nullable: true })
  signedAt: Date | null;

  @Column({
    name: 'document_url',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  documentUrl: string | null;

  @Column({ name: 'termination_reason', type: 'text', nullable: true })
  terminationReason: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;
}
