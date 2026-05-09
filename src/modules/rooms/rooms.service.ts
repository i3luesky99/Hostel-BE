import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomStatus } from '../../entities/enums';
import { Property } from '../../entities/property.entity';
import { RoomPhoto } from '../../entities/room-photo.entity';
import { Room } from '../../entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    @InjectRepository(RoomPhoto)
    private readonly photoRepo: Repository<RoomPhoto>,
  ) {}

  async create(dto: CreateRoomDto) {
    const property = await this.propertyRepo.findOne({
      where: { id: dto.propertyId },
    });
    if (!property)
      throw new NotFoundException(`Property #${dto.propertyId} not found`);

    const row = this.roomRepo.create({
      roomCode: dto.roomCode,
      floor: dto.floor ?? null,
      areaM2: dto.areaM2 ?? null,
      maxOccupancy: dto.maxOccupancy ?? 1,
      amenities: dto.amenities ?? null,
      status: dto.status ?? RoomStatus.AVAILABLE,
      monthlyRent: dto.monthlyRent,
      depositAmount: dto.depositAmount ?? null,
      property: { id: dto.propertyId } as Property,
    });
    const saved = await this.roomRepo.save(row);

    if (dto.photos?.length) {
      await this.photoRepo.save(
        dto.photos.map((p, i) =>
          this.photoRepo.create({
            url: p.url,
            sortOrder: p.sortOrder ?? i,
            isCover: p.isCover ?? false,
            room: { id: saved.id } as Room,
          }),
        ),
      );
    }

    return this.findOne(saved.id);
  }

  findAll(propertyId?: string) {
    return this.roomRepo.find({
      where: propertyId ? { property: { id: propertyId } } : {},
      order: { id: 'ASC' },
      relations: ['property', 'photos'],
    });
  }

  async findOne(id: string) {
    const row = await this.roomRepo.findOne({
      where: { id },
      relations: ['property', 'photos'],
    });
    if (!row) throw new NotFoundException(`Room #${id} not found`);
    if (row.photos?.length) {
      row.photos.sort((a, b) => {
        const byOrder = a.sortOrder - b.sortOrder;
        if (byOrder !== 0) return byOrder;
        return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
      });
    }
    return row;
  }

  async update(id: string, dto: UpdateRoomDto) {
    const room = await this.roomRepo.findOne({ where: { id } });
    if (!room) throw new NotFoundException(`Room #${id} not found`);

    if (dto.propertyId !== undefined) {
      const property = await this.propertyRepo.findOne({
        where: { id: dto.propertyId },
      });
      if (!property)
        throw new NotFoundException(`Property #${dto.propertyId} not found`);
      room.property = property;
    }
    if (dto.roomCode !== undefined) room.roomCode = dto.roomCode;
    if (dto.floor !== undefined) room.floor = dto.floor ?? null;
    if (dto.areaM2 !== undefined) room.areaM2 = dto.areaM2 ?? null;
    if (dto.maxOccupancy !== undefined) room.maxOccupancy = dto.maxOccupancy;
    if (dto.amenities !== undefined) room.amenities = dto.amenities ?? null;
    if (dto.status !== undefined) room.status = dto.status;
    if (dto.monthlyRent !== undefined) room.monthlyRent = dto.monthlyRent;
    if (dto.depositAmount !== undefined)
      room.depositAmount = dto.depositAmount ?? null;

    await this.roomRepo.manager.transaction(async (mgr) => {
      await mgr.save(Room, room);
      if (dto.photos !== undefined) {
        await mgr
          .createQueryBuilder()
          .delete()
          .from(RoomPhoto)
          .where('room_id = :id', { id })
          .execute();
        if (dto.photos.length > 0) {
          const newPhotos = dto.photos.map((p, i) =>
            mgr.create(RoomPhoto, {
              url: p.url,
              sortOrder: p.sortOrder ?? i,
              isCover: p.isCover ?? false,
              room: { id } as Room,
            }),
          );
          await mgr.save(newPhotos);
        }
      }
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.roomRepo.delete(id);
  }
}
