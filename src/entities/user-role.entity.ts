import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AppRole } from './enums';
import { User } from './user.entity';

@Entity('user_roles')
export class UserRole {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: AppRole })
  role: AppRole;
}
