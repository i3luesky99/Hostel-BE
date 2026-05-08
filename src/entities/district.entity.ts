import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Property } from './property.entity';
import { Ward } from './ward.entity';

@Entity('districts')
export class District {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 32 })
  code: string;

  @Column({ length: 128 })
  name: string;

  @Column({ length: 64 })
  type: string;

  @OneToMany(() => Ward, (w) => w.district)
  wards: Ward[];

  @OneToMany(() => Property, (p) => p.district)
  properties: Property[];
}
