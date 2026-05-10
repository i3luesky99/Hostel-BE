import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractOccupant } from '../../entities/contract-occupant.entity';
import { Contract } from '../../entities/contract.entity';
import { Room } from '../../entities/room.entity';
import { TenantProfile } from '../../entities/tenant-profile.entity';
import { UserRole } from '../../entities/user-role.entity';
import { User } from '../../entities/user.entity';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Contract,
      Room,
      User,
      ContractOccupant,
      UserRole,
      TenantProfile,
    ]),
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
