import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { RoomStatus } from '../../../entities/enums';

export class CreateRoomDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  propertyId: string;

  @ApiProperty({ example: '101' })
  @IsString()
  @MaxLength(64)
  roomCode: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  floor?: number | null;

  @ApiPropertyOptional({ example: '20.5' })
  @IsOptional()
  @IsNumberString()
  areaM2?: string | null;

  @ApiPropertyOptional({ example: 2, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxOccupancy?: number;

  @ApiPropertyOptional({ example: { mayLanh: true } })
  @IsOptional()
  @IsObject()
  amenities?: Record<string, unknown> | null;

  @ApiPropertyOptional({ enum: RoomStatus })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @ApiProperty({ example: '3500000.00' })
  @IsNumberString()
  monthlyRent: string;

  @ApiPropertyOptional({ example: '7000000.00' })
  @IsOptional()
  @IsNumberString()
  depositAmount?: string | null;
}
