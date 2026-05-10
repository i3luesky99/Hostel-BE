import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { BillingPeriodStatus } from '../../../entities/enums';

export class CreateBillingPeriodDto {
  @ApiProperty({ example: 2026 })
  @IsInt()
  @Min(2000)
  @Max(2100)
  periodYear: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 12 })
  @IsInt()
  @Min(1)
  @Max(12)
  periodMonth: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  electricityPrevIndex?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  electricityCurrIndex?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  electricityUnitPrice?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  electricityAmount?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  waterPrevIndex?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  waterCurrIndex?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  waterUnitPrice?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  waterAmount?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  internetFee?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  serviceFee?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  rentAmount?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  totalDue?: string | null;

  @ApiPropertyOptional({ enum: BillingPeriodStatus })
  @IsOptional()
  @IsEnum(BillingPeriodStatus)
  status?: BillingPeriodStatus;
}
