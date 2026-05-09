import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';

/** Gửi `photos` để thay toàn bộ ảnh; `photos: []` xóa hết; không gửi `photos` = giữ nguyên. */
export class UpdateRoomDto extends PartialType(CreateRoomDto) {}
