import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingPeriod } from '../../entities/billing-period.entity';
import { Contract } from '../../entities/contract.entity';
import { BillingPeriodStatus } from '../../entities/enums';
import { CreateBillingPeriodDto } from './dto/create-billing-period.dto';
import { UpdateBillingPeriodDto } from './dto/update-billing-period.dto';

@Injectable()
export class BillingPeriodsService {
  constructor(
    @InjectRepository(BillingPeriod)
    private readonly periodRepo: Repository<BillingPeriod>,
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
  ) {}

  private async assertContract(contractId: string): Promise<void> {
    const ok = await this.contractRepo.exist({ where: { id: contractId } });
    if (!ok) throw new NotFoundException(`Contract #${contractId} not found`);
  }

  async create(contractId: string, dto: CreateBillingPeriodDto) {
    await this.assertContract(contractId);
    const dup = await this.periodRepo.exist({
      where: {
        contract: { id: contractId },
        periodYear: dto.periodYear,
        periodMonth: dto.periodMonth,
      },
    });
    if (dup) {
      throw new ConflictException(
        `Billing period ${dto.periodYear}-${dto.periodMonth} already exists for this contract`,
      );
    }
    const row = this.periodRepo.create({
      contract: { id: contractId } as Contract,
      periodYear: dto.periodYear,
      periodMonth: dto.periodMonth,
      electricityPrevIndex: dto.electricityPrevIndex ?? null,
      electricityCurrIndex: dto.electricityCurrIndex ?? null,
      electricityUnitPrice: dto.electricityUnitPrice ?? null,
      electricityAmount: dto.electricityAmount ?? null,
      waterPrevIndex: dto.waterPrevIndex ?? null,
      waterCurrIndex: dto.waterCurrIndex ?? null,
      waterUnitPrice: dto.waterUnitPrice ?? null,
      waterAmount: dto.waterAmount ?? null,
      internetFee: dto.internetFee ?? null,
      serviceFee: dto.serviceFee ?? null,
      rentAmount: dto.rentAmount ?? null,
      totalDue: dto.totalDue ?? null,
      status: dto.status ?? BillingPeriodStatus.DRAFT,
      finalizedAt: null,
    });
    this.applyFinalizedTimestamp(row);
    return this.periodRepo.save(row);
  }

  findAll(contractId: string) {
    return this.periodRepo.find({
      where: { contract: { id: contractId } },
      order: { periodYear: 'DESC', periodMonth: 'DESC', id: 'DESC' },
    });
  }

  async findOne(contractId: string, id: string) {
    const row = await this.periodRepo.findOne({
      where: { id, contract: { id: contractId } },
    });
    if (!row) throw new NotFoundException(`Billing period #${id} not found`);
    return row;
  }

  async update(contractId: string, id: string, dto: UpdateBillingPeriodDto) {
    const row = await this.findOne(contractId, id);
    if (dto.periodYear !== undefined) row.periodYear = dto.periodYear;
    if (dto.periodMonth !== undefined) row.periodMonth = dto.periodMonth;
    if (dto.electricityPrevIndex !== undefined) {
      row.electricityPrevIndex = dto.electricityPrevIndex ?? null;
    }
    if (dto.electricityCurrIndex !== undefined) {
      row.electricityCurrIndex = dto.electricityCurrIndex ?? null;
    }
    if (dto.electricityUnitPrice !== undefined) {
      row.electricityUnitPrice = dto.electricityUnitPrice ?? null;
    }
    if (dto.electricityAmount !== undefined) {
      row.electricityAmount = dto.electricityAmount ?? null;
    }
    if (dto.waterPrevIndex !== undefined) {
      row.waterPrevIndex = dto.waterPrevIndex ?? null;
    }
    if (dto.waterCurrIndex !== undefined) {
      row.waterCurrIndex = dto.waterCurrIndex ?? null;
    }
    if (dto.waterUnitPrice !== undefined) {
      row.waterUnitPrice = dto.waterUnitPrice ?? null;
    }
    if (dto.waterAmount !== undefined) {
      row.waterAmount = dto.waterAmount ?? null;
    }
    if (dto.internetFee !== undefined)
      row.internetFee = dto.internetFee ?? null;
    if (dto.serviceFee !== undefined) row.serviceFee = dto.serviceFee ?? null;
    if (dto.rentAmount !== undefined) row.rentAmount = dto.rentAmount ?? null;
    if (dto.totalDue !== undefined) row.totalDue = dto.totalDue ?? null;
    if (dto.status !== undefined) row.status = dto.status;
    this.applyFinalizedTimestamp(row);
    return this.periodRepo.save(row);
  }

  private applyFinalizedTimestamp(row: BillingPeriod) {
    const locked =
      row.status === BillingPeriodStatus.FINALIZED ||
      row.status === BillingPeriodStatus.PAID;
    if (locked && !row.finalizedAt) {
      row.finalizedAt = new Date();
    }
    if (row.status === BillingPeriodStatus.DRAFT) {
      row.finalizedAt = null;
    }
  }

  async remove(contractId: string, id: string) {
    const row = await this.findOne(contractId, id);
    await this.periodRepo.remove(row);
  }
}
