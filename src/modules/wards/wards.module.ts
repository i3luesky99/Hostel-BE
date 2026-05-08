import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ward } from '../../entities/ward.entity';
import { WardsController } from './wards.controller';
import { WardsService } from './wards.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ward])],
  controllers: [WardsController],
  providers: [WardsService],
})
export class WardsModule {}
