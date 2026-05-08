import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@ApiTags('districts')
@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo quận/huyện' })
  create(@Body() dto: CreateDistrictDto) {
    return this.districtsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách quận/huyện' })
  findAll() {
    return this.districtsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết quận/huyện' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật quận/huyện' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDistrictDto,
  ) {
    return this.districtsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa quận/huyện' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.districtsService.remove(id);
  }
}
