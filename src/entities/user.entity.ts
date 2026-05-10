import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContractOccupant } from './contract-occupant.entity';
import { UserStatus } from './enums';
import { Contract } from './contract.entity';
import { Property } from './property.entity';
import { TenantProfile } from './tenant-profile.entity';
import { UserRole } from './user-role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ name: 'full_name', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  phone: string | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles: UserRole[];

  @OneToOne(() => TenantProfile, (tp) => tp.user)
  tenantProfile?: TenantProfile;

  @OneToMany(() => Property, (p) => p.owner)
  ownedProperties: Property[];

  @OneToMany(() => Contract, (c) => c.tenant)
  tenantContracts: Contract[];

  @OneToMany(() => Contract, (c) => c.owner)
  ownerContracts: Contract[];

  @OneToMany(() => ContractOccupant, (co) => co.user)
  contractOccupancies: ContractOccupant[];
}
