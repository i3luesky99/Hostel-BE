import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from '../../entities/district.entity';
import { Property } from '../../entities/property.entity';
import { User } from '../../entities/user.entity';
import { Ward } from '../../entities/ward.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
  ) {}

  create(dto: CreatePropertyDto) {
    const row = this.propertyRepo.create({
      name: dto.name,
      addressLine: dto.addressLine,
      lat: dto.lat ?? null,
      lng: dto.lng ?? null,
      description: dto.description ?? null,
      owner: { id: dto.ownerId } as User,
      district: { id: dto.districtId } as District,
      ward: dto.wardId != null ? ({ id: dto.wardId } as Ward) : null,
    });
    return this.propertyRepo.save(row);
  }

  findAll(ownerId?: string) {
    return this.propertyRepo.find({
      where: ownerId ? { owner: { id: ownerId } } : {},
      order: { id: 'ASC' },
      relations: ['owner', 'district', 'ward'],
    });
  }

  async findOne(id: string) {
    const row = await this.propertyRepo.findOne({
      where: { id },
      relations: ['owner', 'district', 'ward', 'rooms'],
    });
    if (!row) throw new NotFoundException(`Property #${id} not found`);
    return row;
  }

  async update(id: string, dto: UpdatePropertyDto) {
    const prop = await this.findOne(id);
    if (dto.name !== undefined) prop.name = dto.name;
    if (dto.addressLine !== undefined) prop.addressLine = dto.addressLine;
    if (dto.lat !== undefined) prop.lat = dto.lat ?? null;
    if (dto.lng !== undefined) prop.lng = dto.lng ?? null;
    if (dto.description !== undefined)
      prop.description = dto.description ?? null;
    if (dto.ownerId !== undefined) prop.owner = { id: dto.ownerId } as User;
    if (dto.districtId !== undefined)
      prop.district = { id: dto.districtId } as District;
    if (dto.wardId !== undefined)
      prop.ward = dto.wardId != null ? ({ id: dto.wardId } as Ward) : null;
    return this.propertyRepo.save(prop);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.propertyRepo.delete(id);
  }
}
