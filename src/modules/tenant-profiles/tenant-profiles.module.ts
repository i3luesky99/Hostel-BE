import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantProfile } from '../../entities/tenant-profile.entity';
import { User } from '../../entities/user.entity';
import { TenantProfilesController } from './tenant-profiles.controller';
import { TenantProfilesService } from './tenant-profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([TenantProfile, User])],
  controllers: [TenantProfilesController],
  providers: [TenantProfilesService],
})
export class TenantProfilesModule {}
