import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../../entities/contract.entity';
import { Room } from '../../entities/room.entity';
import { User } from '../../entities/user.entity';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contract, Room, User])],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
