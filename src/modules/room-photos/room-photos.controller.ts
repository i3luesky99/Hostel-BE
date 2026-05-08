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
import { CreateRoomPhotoDto } from './dto/create-room-photo.dto';
import { UpdateRoomPhotoDto } from './dto/update-room-photo.dto';
import { RoomPhotosService } from './room-photos.service';

@ApiTags('room-photos')
@Controller('room-photos')
export class RoomPhotosController {
  constructor(private readonly roomPhotosService: RoomPhotosService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm ảnh phòng' })
  create(@Body() dto: CreateRoomPhotoDto) {
    return this.roomPhotosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách ảnh' })
  @ApiQuery({ name: 'roomId', required: false })
  findAll(@Query('roomId') roomId?: string) {
    return this.roomPhotosService.findAll(roomId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết ảnh' })
  findOne(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.roomPhotosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật ảnh' })
  update(
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdateRoomPhotoDto,
  ) {
    return this.roomPhotosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa ảnh' })
  remove(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.roomPhotosService.remove(id);
  }
}
