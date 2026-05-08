import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomPhoto } from '../../entities/room-photo.entity';
import { Room } from '../../entities/room.entity';
import { RoomPhotosController } from './room-photos.controller';
import { RoomPhotosService } from './room-photos.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomPhoto, Room])],
  controllers: [RoomPhotosController],
  providers: [RoomPhotosService],
})
export class RoomPhotosModule {}
