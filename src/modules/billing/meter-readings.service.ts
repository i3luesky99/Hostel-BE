import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../../entities/contract.entity';
import { MeterReading } from '../../entities/meter-reading.entity';
import { CreateMeterReadingDto } from './dto/create-meter-reading.dto';
import { UpdateMeterReadingDto } from './dto/update-meter-reading.dto';

@Injectable()
export class MeterReadingsService {
  constructor(
    @InjectRepository(MeterReading)
    private readonly readingRepo: Repository<MeterReading>,
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
  ) {}

  private async assertContract(contractId: string): Promise<void> {
    const ok = await this.contractRepo.exist({ where: { id: contractId } });
    if (!ok) throw new NotFoundException(`Contract #${contractId} not found`);
  }

  async create(contractId: string, dto: CreateMeterReadingDto) {
    await this.assertContract(contractId);
    const row = this.readingRepo.create({
      contract: { id: contractId } as Contract,
      utilityType: dto.utilityType,
      readingAt: dto.readingAt,
      indexValue: dto.indexValue,
      photoUrl: dto.photoUrl ?? null,
      notes: dto.notes ?? null,
    });
    return this.readingRepo.save(row);
  }

  findAll(contractId: string) {
    return this.readingRepo.find({
      where: { contract: { id: contractId } },
      order: { readingAt: 'DESC', utilityType: 'ASC', id: 'DESC' },
    });
  }

  async findOne(contractId: string, id: string) {
    const row = await this.readingRepo.findOne({
      where: { id, contract: { id: contractId } },
    });
    if (!row) throw new NotFoundException(`Meter reading #${id} not found`);
    return row;
  }

  async update(contractId: string, id: string, dto: UpdateMeterReadingDto) {
    const row = await this.findOne(contractId, id);
    if (dto.utilityType !== undefined) row.utilityType = dto.utilityType;
    if (dto.readingAt !== undefined) row.readingAt = dto.readingAt;
    if (dto.indexValue !== undefined) row.indexValue = dto.indexValue;
    if (dto.photoUrl !== undefined) row.photoUrl = dto.photoUrl ?? null;
    if (dto.notes !== undefined) row.notes = dto.notes ?? null;
    return this.readingRepo.save(row);
  }

  async remove(contractId: string, id: string) {
    const row = await this.findOne(contractId, id);
    await this.readingRepo.remove(row);
  }
}
