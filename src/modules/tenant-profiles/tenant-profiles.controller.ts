import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseBigIntIdPipe } from '../../common/pipes/parse-bigint-id.pipe';
import { CreateTenantProfileDto } from './dto/create-tenant-profile.dto';
import { UpdateTenantProfileDto } from './dto/update-tenant-profile.dto';
import { TenantProfilesService } from './tenant-profiles.service';

@ApiTags('tenant-profiles')
@Controller('tenant-profiles')
export class TenantProfilesController {
  constructor(private readonly tenantProfilesService: TenantProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hồ sơ người thuê (1–1 với user)' })
  create(@Body() dto: CreateTenantProfileDto) {
    return this.tenantProfilesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách hồ sơ người thuê' })
  findAll() {
    return this.tenantProfilesService.findAll();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Chi tiết theo user_id' })
  findOne(@Param('userId', ParseBigIntIdPipe) userId: string) {
    return this.tenantProfilesService.findOne(userId);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Cập nhật hồ sơ' })
  update(
    @Param('userId', ParseBigIntIdPipe) userId: string,
    @Body() dto: UpdateTenantProfileDto,
  ) {
    return this.tenantProfilesService.update(userId, dto);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Xóa hồ sơ' })
  remove(@Param('userId', ParseBigIntIdPipe) userId: string) {
    return this.tenantProfilesService.remove(userId);
  }
}
