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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ParseBigIntIdPipe } from '../../common/pipes/parse-bigint-id.pipe';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo phòng' })
  create(@Body() dto: CreateRoomDto) {
    return this.roomsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách phòng' })
  @ApiQuery({ name: 'propertyId', required: false })
  findAll(@Query('propertyId') propertyId?: string) {
    return this.roomsService.findAll(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết phòng' })
  findOne(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật phòng' })
  update(
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.roomsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa phòng' })
  remove(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.roomsService.remove(id);
  }
}
