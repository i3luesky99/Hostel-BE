import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { District } from '../../entities/district.entity';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';

@Injectable()
export class DistrictsService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
  ) {}

  create(dto: CreateDistrictDto) {
    const row = this.districtRepo.create(dto);
    return this.districtRepo.save(row);
  }

  findAll() {
    return this.districtRepo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const row = await this.districtRepo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`District #${id} not found`);
    return row;
  }

  async update(id: number, dto: UpdateDistrictDto) {
    await this.findOne(id);
    await this.districtRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.districtRepo.delete(id);
  }
}
