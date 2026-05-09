import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/** Ảnh phòng gửi kèm POST/PATCH /rooms (không có roomId — gắn theo phòng). */
export class RoomPhotoInputDto {
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
