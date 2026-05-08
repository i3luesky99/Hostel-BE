import { PartialType } from '@nestjs/swagger';
import { CreateRoomPhotoDto } from './create-room-photo.dto';

export class UpdateRoomPhotoDto extends PartialType(CreateRoomPhotoDto) {}
