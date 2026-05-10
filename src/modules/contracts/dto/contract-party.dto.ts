import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

/** Người đại diện — luôn tạo tài khoản user. */
export class ContractRepresentativeDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiPropertyOptional({
    description:
      'Nếu có: dùng làm email đăng nhập. Nếu không: sinh theo ward-phòng-chữ cái đầu.',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: '0909123456' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string | null;

  @ApiPropertyOptional({
    description: 'CCCD — nếu có sẽ tạo tenant_profiles (phải unique).',
  })
  @IsOptional()
  @IsString()
  @MaxLength(12)
  citizenId?: string;

  @ApiPropertyOptional({
    description:
      'Mật khẩu tùy chỉnh (≥8). Bỏ trống = hệ thống sinh ngẫu nhiên (trả về một lần trong response).',
    minLength: 8,
  })
  @ValidateIf((_, v) => v != null && v !== '')
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  initialPassword?: string;
}

/** Người ở cùng — luôn tạo user + role tenant (giống quy tắc đại diện). */
export class ContractCoTenantDto {
  @ApiProperty({ example: 'Trần Thị B' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiPropertyOptional({
    description:
      'Có email thì dùng đăng nhập; không thì sinh tự động (ward-phòng-chữ cái đầu).',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(12)
  citizenId?: string;

  @ApiPropertyOptional({ minLength: 8 })
  @ValidateIf((_, v) => v != null && v !== '')
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  initialPassword?: string;
}
