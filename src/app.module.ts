import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsModule } from './modules/contracts/contracts.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { RoomPhotosModule } from './modules/room-photos/room-photos.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { TenantProfilesModule } from './modules/tenant-profiles/tenant-profiles.module';
import { UserRolesModule } from './modules/user-roles/user-roles.module';
import { UsersModule } from './modules/users/users.module';
import { WardsModule } from './modules/wards/wards.module';

function envFlag(value: string | undefined): boolean {
  if (value == null) return false;
  return ['1', 'true', 'yes'].includes(value.toLowerCase());
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USERNAME', 'hostel'),
        password: config.get<string>('DB_PASSWORD', 'hostel_dev'),
        database: config.get<string>('DB_DATABASE', 'hostel'),
        autoLoadEntities: true,
        synchronize: envFlag(config.get<string>('TYPEORM_SYNC')),
      }),
    }),
    DistrictsModule,
    WardsModule,
    UsersModule,
    UserRolesModule,
    TenantProfilesModule,
    PropertiesModule,
    RoomsModule,
    RoomPhotosModule,
    ContractsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
