import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty({ example: 'HCMC-Q2' })
  @IsString()
  @MaxLength(32)
  code: string;

  @ApiProperty({ example: 'Quận 2' })
  @IsString()
  @MaxLength(128)
  name: string;

  @ApiProperty({ example: 'urban_district' })
  @IsString()
  @MaxLength(64)
  type: string;
}
