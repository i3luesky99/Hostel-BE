import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../entities/room.entity';
import { RoomPhoto } from '../../entities/room-photo.entity';
import { CreateRoomPhotoDto } from './dto/create-room-photo.dto';
import { UpdateRoomPhotoDto } from './dto/update-room-photo.dto';

@Injectable()
export class RoomPhotosService {
  constructor(
    @InjectRepository(RoomPhoto)
    private readonly photoRepo: Repository<RoomPhoto>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  async create(dto: CreateRoomPhotoDto) {
    const room = await this.roomRepo.findOne({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException(`Room #${dto.roomId} not found`);
    const row = this.photoRepo.create({
      url: dto.url,
      sortOrder: dto.sortOrder ?? 0,
      isCover: dto.isCover ?? false,
      room: { id: dto.roomId } as Room,
    });
    return this.photoRepo.save(row);
  }

  findAll(roomId?: string) {
    return this.photoRepo.find({
      where: roomId ? { room: { id: roomId } } : {},
      order: { sortOrder: 'ASC', id: 'ASC' },
      relations: ['room'],
    });
  }

  async findOne(id: string) {
    const row = await this.photoRepo.findOne({
      where: { id },
      relations: ['room'],
    });
    if (!row) throw new NotFoundException(`Room photo #${id} not found`);
    return row;
  }

  async update(id: string, dto: UpdateRoomPhotoDto) {
    const photo = await this.findOne(id);
    if (dto.roomId !== undefined) {
      const room = await this.roomRepo.findOne({ where: { id: dto.roomId } });
      if (!room) throw new NotFoundException(`Room #${dto.roomId} not found`);
      photo.room = room;
    }
    if (dto.url !== undefined) photo.url = dto.url;
    if (dto.sortOrder !== undefined) photo.sortOrder = dto.sortOrder;
    if (dto.isCover !== undefined) photo.isCover = dto.isCover;
    return this.photoRepo.save(photo);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.photoRepo.delete(id);
  }
}
