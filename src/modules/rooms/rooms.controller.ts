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
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomsService } from './rooms.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo phòng',
    description:
      'Có thể gửi kèm `photos` (url, sortOrder?, isCover?) để tạo ảnh cùng lúc.',
  })
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
  @ApiOperation({
    summary: 'Cập nhật phòng',
    description:
      'Nếu body có `photos`: thay toàn bộ ảnh của phòng; `photos: []` xóa hết ảnh. Không gửi `photos` = giữ ảnh hiện tại.',
  })
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
