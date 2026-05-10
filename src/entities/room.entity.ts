import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Contract } from './contract.entity';
import { RoomStatus } from './enums';
import { Property } from './property.entity';
import { RoomPhoto } from './room-photo.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => Property, (p) => p.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column({ name: 'room_code', length: 64 })
  roomCode: string;

  @Column({
    name: 'max_occupancy',
    type: 'tinyint',
    unsigned: true,
    default: 1,
  })
  maxOccupancy: number;

  @Column({ type: 'json', nullable: true })
  amenities: Record<string, unknown> | null;

  @Column({
    type: 'enum',
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

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
    nullable: true,
  })
  depositAmount: string | null;

  @Column({
    name: 'internet_fee_monthly',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  internetFeeMonthly: string | null;

  /** Tiền dịch vụ cố định / tháng (chung chung: giữ xe, rác, …). */
  @Column({
    name: 'service_fee_monthly',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
  })
  serviceFeeMonthly: string | null;

  @OneToMany(() => RoomPhoto, (rp) => rp.room)
  photos: RoomPhoto[];

  @OneToMany(() => Contract, (c) => c.room)
  contracts: Contract[];
}
