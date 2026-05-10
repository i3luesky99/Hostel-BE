import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import {
  BillingPeriod,
  Contract,
  ContractOccupant,
  District,
  MeterReading,
  Property,
  Room,
  RoomPhoto,
  TenantProfile,
  User,
  UserRole,
  Ward,
} from './entities';

dotenv.config({ path: '.env' });

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME ?? 'hostel',
  password: process.env.DB_PASSWORD ?? 'hostel_dev',
  database: process.env.DB_DATABASE ?? 'hostel',
  entities: [
    User,
    UserRole,
    TenantProfile,
    District,
    Ward,
    Property,
    Room,
    RoomPhoto,
    Contract,
    ContractOccupant,
    MeterReading,
    BillingPeriod,
  ],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
});
