import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  ownerId: string;

  @ApiProperty({ example: 'Dãy trọ ABC' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '123 Đường X, Quận 1' })
  @IsString()
  @MaxLength(512)
  addressLine: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  districtId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  wardId?: number | null;

  @ApiPropertyOptional({ example: '10.776889' })
  @IsOptional()
  @IsNumberString()
  lat?: string | null;

  @ApiPropertyOptional({ example: '106.700806' })
  @IsOptional()
  @IsNumberString()
  lng?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string | null;
}
