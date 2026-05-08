import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRoomPhotoDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  roomId: string;

  @ApiProperty({ example: 'https://cdn.example.com/r1.jpg' })
  @IsString()
  @MaxLength(512)
  url: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isCover?: boolean;
}
