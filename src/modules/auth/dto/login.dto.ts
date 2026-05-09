import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'owner@demo.local' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Test@1234' })
  @IsString()
  @MinLength(1)
  password: string;
}
