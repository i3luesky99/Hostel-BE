import { PartialType } from '@nestjs/mapped-types';
import { CreateBillingPeriodDto } from './create-billing-period.dto';

export class UpdateBillingPeriodDto extends PartialType(
  CreateBillingPeriodDto,
) {}
