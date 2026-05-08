import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomStatus } from '../../entities/enums';
import { Property } from '../../entities/property.entity';
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
    return this.roomRepo.save(row);
  }

  findAll(propertyId?: string) {
    return this.roomRepo.find({
      where: propertyId ? { property: { id: propertyId } } : {},
      order: { id: 'ASC' },
      relations: ['property'],
    });
  }

  async findOne(id: string) {
    const row = await this.roomRepo.findOne({
      where: { id },
      relations: ['property', 'photos'],
    });
    if (!row) throw new NotFoundException(`Room #${id} not found`);
    return row;
  }

  async update(id: string, dto: UpdateRoomDto) {
    const room = await this.findOne(id);
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
    return this.roomRepo.save(room);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.roomRepo.delete(id);
  }
}
