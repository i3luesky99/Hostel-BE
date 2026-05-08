import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';
import { Property } from './property.entity';

@Entity('wards')
export class Ward {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => District, (d) => d.wards, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'district_id' })
  district: District;

  @Column({ length: 128 })
  name: string;

  @OneToMany(() => Property, (p) => p.ward)
  properties: Property[];
}
