import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateTenantProfileDto {
  @ApiProperty({ example: '2' })
  @IsString()
  userId: string;

  @ApiProperty({ example: '079099014101' })
  @IsString()
  @Length(12, 12)
  citizenId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  photoUrl?: string | null;

  @ApiPropertyOptional({ example: '2015-06-01' })
  @IsOptional()
  @IsDateString()
  citizenIdIssueDate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  citizenIdIssuePlace?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  citizenIdFrontUrl?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(512)
  citizenIdBackUrl?: string | null;
}
