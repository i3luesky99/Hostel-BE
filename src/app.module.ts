import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TenantReadOnlyGuard } from './common/guards/tenant-readonly.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BillingModule } from './modules/billing/billing.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { TenantProfilesModule } from './modules/tenant-profiles/tenant-profiles.module';
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
    AuthModule,
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
    TenantProfilesModule,
    PropertiesModule,
    RoomsModule,
    ContractsModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guards run in registration order (see ContextCreator). JWT must run first so req.user exists.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: TenantReadOnlyGuard },
  ],
})
export class AppModule {}
