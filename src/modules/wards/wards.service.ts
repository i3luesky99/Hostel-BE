import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from '../../entities/district.entity';
import { Ward } from '../../entities/ward.entity';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';

@Injectable()
export class WardsService {
  constructor(
    @InjectRepository(Ward)
    private readonly wardRepo: Repository<Ward>,
  ) {}

  create(dto: CreateWardDto) {
    const row = this.wardRepo.create({
      name: dto.name,
      district: { id: dto.districtId } as District,
    });
    return this.wardRepo.save(row);
  }

  findAll(districtId?: number) {
    return this.wardRepo.find({
      where: districtId ? { district: { id: districtId } } : {},
      order: { id: 'ASC' },
      relations: ['district'],
    });
  }

  async findOne(id: number) {
    const row = await this.wardRepo.findOne({
      where: { id },
      relations: ['district'],
    });
    if (!row) throw new NotFoundException(`Ward #${id} not found`);
    return row;
  }

  async update(id: number, dto: UpdateWardDto) {
    const ward = await this.findOne(id);
    if (dto.name !== undefined) ward.name = dto.name;
    if (dto.districtId !== undefined)
      ward.district = { id: dto.districtId } as District;
    return this.wardRepo.save(ward);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.wardRepo.delete(id);
  }
}
