import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('tenant_profiles')
export class TenantProfile {
  @PrimaryColumn({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: string;

  @OneToOne(() => User, (user) => user.tenantProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'photo_url', type: 'varchar', length: 512, nullable: true })
  photoUrl: string | null;

  @Column({ name: 'citizen_id', type: 'varchar', length: 12, unique: true })
  citizenId: string;

  @Column({ name: 'citizen_id_issue_date', type: 'date', nullable: true })
  citizenIdIssueDate: Date | null;

  @Column({
    name: 'citizen_id_issue_place',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  citizenIdIssuePlace: string | null;

  @Column({
    name: 'citizen_id_front_url',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  citizenIdFrontUrl: string | null;

  @Column({
    name: 'citizen_id_back_url',
    type: 'varchar',
    length: 512,
    nullable: true,
  })
  citizenIdBackUrl: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
