import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ContractStatus } from '../../../entities/enums';
import {
  ContractCoTenantDto,
  ContractRepresentativeDto,
} from './contract-party.dto';

export class CreateContractDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  roomId: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  ownerUserId: string;

  @ApiProperty({ type: ContractRepresentativeDto })
  @ValidateNested()
  @Type(() => ContractRepresentativeDto)
  representative: ContractRepresentativeDto;

  @ApiProperty({
    type: [ContractCoTenantDto],
    description:
      'Ít nhất một người ở cùng; mỗi người luôn được tạo user + tenant (giống đại diện).',
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ContractCoTenantDto)
  coTenants: ContractCoTenantDto[];

  @ApiProperty({ example: 'HD-2025-001' })
  @IsString()
  @MaxLength(64)
  contractNo: string;

  @ApiProperty({ example: '2025-01-01' })
  @IsString()
  startDate: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string | null;

  @ApiProperty({ example: '3500000.00' })
  @IsNumberString()
  monthlyRent: string;

  @ApiProperty({ example: '7000000.00' })
  @IsNumberString()
  depositAmount: string;

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
