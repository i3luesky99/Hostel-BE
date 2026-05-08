import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';
import { Room } from './room.entity';
import { User } from './user.entity';
import { Ward } from './ward.entity';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => User, (user) => user.ownedProperties, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ length: 255 })
  name: string;

  @Column({ name: 'address_line', type: 'varchar', length: 512 })
  addressLine: string;

  @ManyToOne(() => District, (d) => d.properties, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => Ward, (w) => w.properties, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'ward_id' })
  ward: Ward | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lat: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lng: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @OneToMany(() => Room, (r) => r.property)
  rooms: Room[];
}
