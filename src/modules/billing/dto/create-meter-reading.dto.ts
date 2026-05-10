import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UtilityType } from '../../../entities/enums';

export class CreateMeterReadingDto {
  @ApiProperty({ enum: UtilityType })
  @IsEnum(UtilityType)
  utilityType: UtilityType;

  @ApiProperty({
    example: '2026-05-01',
    description: 'Ngày ghi chỉ số (YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  readingAt: string;

  @ApiProperty({
    example: '1523.4500',
    description: 'Chỉ số công tơ tại ngày đó',
  })
  @IsNumberString()
  indexValue: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  photoUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string | null;
}
