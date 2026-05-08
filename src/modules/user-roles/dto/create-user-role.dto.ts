import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumberString } from 'class-validator';
import { AppRole } from '../../../entities/enums';

export class CreateUserRoleDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  userId: string;

  @ApiProperty({ enum: AppRole })
  @IsEnum(AppRole)
  role: AppRole;
}
