import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ContractStatus } from '../../../entities/enums';

export class UpdateContractDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  roomId?: string;

  @ApiPropertyOptional({ example: '2' })
  @IsOptional()
  @IsNumberString()
  tenantUserId?: string;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  ownerUserId?: string;

  @ApiPropertyOptional({ example: 'HD-2025-001' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  contractNo?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string | null;

  @ApiPropertyOptional({ example: '3500000.00' })
  @IsOptional()
  @IsNumberString()
  monthlyRent?: string;

  @ApiPropertyOptional({ example: '7000000.00' })
  @IsOptional()
  @IsNumberString()
  depositAmount?: string;

  @ApiPropertyOptional({ enum: ContractStatus })
  @IsOptional()
  @IsEnum(ContractStatus)
  status?: ContractStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  terminationReason?: string | null;
}
