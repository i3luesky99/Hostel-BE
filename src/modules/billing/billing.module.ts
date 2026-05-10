import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingPeriod } from '../../entities/billing-period.entity';
import { Contract } from '../../entities/contract.entity';
import { MeterReading } from '../../entities/meter-reading.entity';
import { BillingPeriodsController } from './billing-periods.controller';
import { BillingPeriodsService } from './billing-periods.service';
import { MeterReadingsController } from './meter-readings.controller';
import { MeterReadingsService } from './meter-readings.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeterReading, BillingPeriod, Contract])],
  controllers: [MeterReadingsController, BillingPeriodsController],
  providers: [MeterReadingsService, BillingPeriodsService],
})
export class BillingModule {}
