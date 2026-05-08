import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../../entities/contract.entity';
import { Room } from '../../entities/room.entity';
import { User } from '../../entities/user.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private async assertFk(roomId: string, tenantId: string, ownerId: string) {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException(`Room #${roomId} not found`);
    const tenant = await this.userRepo.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException(`User #${tenantId} not found`);
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new NotFoundException(`User #${ownerId} not found`);
  }

  async create(dto: CreateContractDto) {
    await this.assertFk(dto.roomId, dto.tenantUserId, dto.ownerUserId);
    const row = this.contractRepo.create({
      contractNo: dto.contractNo,
      startDate: dto.startDate,
      endDate: dto.endDate ?? null,
      monthlyRent: dto.monthlyRent,
      depositAmount: dto.depositAmount,
      status: dto.status,
      documentUrl: dto.documentUrl ?? null,
      terminationReason: dto.terminationReason ?? null,
      room: { id: dto.roomId } as Room,
      tenant: { id: dto.tenantUserId } as User,
      owner: { id: dto.ownerUserId } as User,
    });
    return this.contractRepo.save(row);
  }

  findAll() {
    return this.contractRepo.find({
      order: { id: 'ASC' },
      relations: ['room', 'tenant', 'owner'],
    });
  }

  async findOne(id: string) {
    const row = await this.contractRepo.findOne({
      where: { id },
      relations: ['room', 'tenant', 'owner'],
    });
    if (!row) throw new NotFoundException(`Contract #${id} not found`);
    return row;
  }

  async update(id: string, dto: UpdateContractDto) {
    const c = await this.findOne(id);
    const nextRoomId = dto.roomId ?? c.room.id;
    const nextTenantId = dto.tenantUserId ?? c.tenant.id;
    const nextOwnerId = dto.ownerUserId ?? c.owner.id;
    if (
      dto.roomId !== undefined ||
      dto.tenantUserId !== undefined ||
      dto.ownerUserId !== undefined
    ) {
      await this.assertFk(nextRoomId, nextTenantId, nextOwnerId);
    }
    if (dto.roomId !== undefined) c.room = { id: dto.roomId } as Room;
    if (dto.tenantUserId !== undefined)
      c.tenant = { id: dto.tenantUserId } as User;
    if (dto.ownerUserId !== undefined)
      c.owner = { id: dto.ownerUserId } as User;
    if (dto.contractNo !== undefined) c.contractNo = dto.contractNo;
    if (dto.startDate !== undefined) c.startDate = dto.startDate;
    if (dto.endDate !== undefined) c.endDate = dto.endDate ?? null;
    if (dto.monthlyRent !== undefined) c.monthlyRent = dto.monthlyRent;
    if (dto.depositAmount !== undefined) c.depositAmount = dto.depositAmount;
    if (dto.status !== undefined) c.status = dto.status;
    if (dto.documentUrl !== undefined) c.documentUrl = dto.documentUrl ?? null;
    if (dto.terminationReason !== undefined)
      c.terminationReason = dto.terminationReason ?? null;
    return this.contractRepo.save(c);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.contractRepo.delete(id);
  }
}
