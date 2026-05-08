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

  @Column({ type: 'int', nullable: true })
  floor: number | null;

  @Column({
    name: 'area_m2',
    type: 'decimal',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  areaM2: string | null;

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

  @OneToMany(() => RoomPhoto, (rp) => rp.room)
  photos: RoomPhoto[];

  @OneToMany(() => Contract, (c) => c.room)
  contracts: Contract[];
}
