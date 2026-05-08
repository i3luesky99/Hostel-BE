import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { WardsService } from './wards.service';

@ApiTags('wards')
@Controller('wards')
export class WardsController {
  constructor(private readonly wardsService: WardsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo phường/xã' })
  create(@Body() dto: CreateWardDto) {
    return this.wardsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách phường/xã' })
  @ApiQuery({ name: 'districtId', required: false, type: Number })
  findAll(@Query('districtId') districtId?: string) {
    const id = districtId ? parseInt(districtId, 10) : undefined;
    return this.wardsService.findAll(Number.isFinite(id) ? id : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phường/xã' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wardsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật phường/xã' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWardDto) {
    return this.wardsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phường/xã' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.wardsService.remove(id);
  }
}
