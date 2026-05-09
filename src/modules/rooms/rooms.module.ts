import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { RoomPhoto } from '../../entities/room-photo.entity';
import { Room } from '../../entities/room.entity';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Property, RoomPhoto])],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}
