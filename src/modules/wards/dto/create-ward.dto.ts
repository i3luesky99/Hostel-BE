import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateWardDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  districtId: number;

  @ApiProperty({ example: 'Phường Bến Nghé' })
  @IsString()
  @MaxLength(128)
  name: string;
}
