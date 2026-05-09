import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseBigIntIdPipe } from '../../common/pipes/parse-bigint-id.pipe';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo cơ sở / dãy trọ' })
  create(@Body() dto: CreatePropertyDto) {
    return this.propertiesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách cơ sở' })
  @ApiQuery({ name: 'ownerId', required: false })
  findAll(@Query('ownerId') ownerId?: string) {
    return this.propertiesService.findAll(ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết cơ sở' })
  findOne(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật cơ sở' })
  update(
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa cơ sở' })
  remove(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.propertiesService.remove(id);
  }
}
