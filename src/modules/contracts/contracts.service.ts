import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';
import { ContractOccupant } from '../../entities/contract-occupant.entity';
import { Contract } from '../../entities/contract.entity';
import { AppRole, UserStatus } from '../../entities/enums';
import { Room } from '../../entities/room.entity';
import { TenantProfile } from '../../entities/tenant-profile.entity';
import { UserRole } from '../../entities/user-role.entity';
import { User } from '../../entities/user.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import {
  ContractCoTenantDto,
  ContractRepresentativeDto,
} from './dto/contract-party.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import {
  buildSyntheticEmailLocalPart,
  randomProvisionPassword,
} from './utils/contract-account.util';

const contractRelations = [
  'room',
  'tenant',
  'owner',
  'occupants',
  'occupants.user',
] as const;

export type ProvisionedAccount = {
  kind: 'representative' | 'co_tenant';
  userId: string;
  email: string;
  /** Chỉ trả một lần khi tạo hợp đồng — lưu/gửi cho tenant. */
  initialPassword: string;
};

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>,
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(ContractOccupant)
    private readonly occupantRepo: Repository<ContractOccupant>,
    private readonly config: ConfigService,
  ) {}

  private tenantEmailDomain(): string {
    return this.config.get<string>(
      'TENANT_EMAIL_DOMAIN',
      'tenant.hostel.local',
    );
  }

  private uniqueIds(ids: string[]): string[] {
    return [...new Set(ids)];
  }

  private async allocateEmail(
    mgr: EntityManager,
    localBase: string,
    used: Set<string>,
  ): Promise<string> {
    const domain = this.tenantEmailDomain();
    let n = 0;
    while (n < 500) {
      const local = n === 0 ? localBase : `${localBase}-${n}`.slice(0, 200);
      const email = `${local}@${domain}`.toLowerCase();
      if (used.has(email)) {
        n += 1;
        continue;
      }
      const exists = await mgr.getRepository(User).exist({ where: { email } });
      if (!exists) {
        used.add(email);
        return email;
      }
      n += 1;
    }
    throw new BadRequestException('Could not allocate unique tenant email');
  }

  private async provisionTenantUser(
    mgr: EntityManager,
    party: ContractRepresentativeDto | ContractCoTenantDto,
    wardName: string,
    roomCode: string,
    usedEmails: Set<string>,
  ): Promise<{ user: User; plainPassword: string }> {
    const plain =
      party.initialPassword != null && party.initialPassword.length >= 8
        ? party.initialPassword
        : randomProvisionPassword();
    const hash = await bcrypt.hash(plain, 10);

    let email: string;
    if (party.email != null && party.email.trim() !== '') {
      const normalized = party.email.trim().toLowerCase();
      if (usedEmails.has(normalized)) {
        throw new BadRequestException(
          `Duplicate email in request: ${normalized}`,
        );
      }
      const exists = await mgr.getRepository(User).exist({
        where: { email: normalized },
      });
      if (exists) {
        throw new BadRequestException(
          `Email already registered: ${normalized}`,
        );
      }
      usedEmails.add(normalized);
      email = normalized;
    } else {
      const local = buildSyntheticEmailLocalPart(
        wardName,
        roomCode,
        party.fullName,
      );
      email = await this.allocateEmail(mgr, local, usedEmails);
    }

    const user = mgr.create(User, {
      email,
      passwordHash: hash,
      fullName: party.fullName,
      phone: party.phone ?? null,
      status: UserStatus.ACTIVE,
    });
    const saved = await mgr.save(user);
    await mgr.save(mgr.create(UserRole, { role: AppRole.TENANT, user: saved }));

    const citizenId =
      'citizenId' in party && party.citizenId ? party.citizenId.trim() : '';
    if (citizenId) {
      const taken = await mgr
        .getRepository(TenantProfile)
        .exist({ where: { citizenId } });
      if (taken) {
        throw new BadRequestException(`citizenId already used: ${citizenId}`);
      }
      await mgr.save(
        mgr.create(TenantProfile, {
          userId: saved.id,
          citizenId,
          photoUrl: null,
        }),
      );
    }

    return { user: saved, plainPassword: plain };
  }

  private async validateOccupants(
    room: Room,
    representativeUserId: string,
    occupantUserIds: string[],
  ): Promise<void> {
    const unique = this.uniqueIds(occupantUserIds);
    if (unique.length !== occupantUserIds.length) {
      throw new BadRequestException(
        'occupantUserIds must not contain duplicates',
      );
    }
    if (unique.includes(representativeUserId)) {
      throw new BadRequestException(
        'Representative must not appear in occupantUserIds',
      );
    }
    const cap = room.maxOccupancy;
    if (cap != null && cap > 0) {
      const total = 1 + unique.length;
      if (total > cap) {
        throw new BadRequestException(
          `Room max occupancy is ${cap} (representative + occupants).`,
        );
      }
    }
    for (const uid of unique) {
      const exists = await this.userRepo.exist({ where: { id: uid } });
      if (!exists) throw new NotFoundException(`User #${uid} not found`);
    }
  }

  private async replaceOccupants(
    contractId: string,
    occupantUserIds: string[],
  ): Promise<void> {
    await this.occupantRepo.delete({
      contract: { id: contractId } as Contract,
    });
    if (!occupantUserIds.length) return;
    await this.occupantRepo.save(
      occupantUserIds.map((uid) =>
        this.occupantRepo.create({
          contract: { id: contractId } as Contract,
          user: { id: uid } as User,
        }),
      ),
    );
  }

  private async assertFk(roomId: string, tenantId: string, ownerId: string) {
    const room = await this.roomRepo.findOne({ where: { id: roomId } });
    if (!room) throw new NotFoundException(`Room #${roomId} not found`);
    const tenant = await this.userRepo.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException(`User #${tenantId} not found`);
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new NotFoundException(`User #${ownerId} not found`);
    return room;
  }

  async create(dto: CreateContractDto): Promise<{
    contract: Contract;
    provisionedAccounts: ProvisionedAccount[];
  }> {
    const room = await this.roomRepo.findOne({
      where: { id: dto.roomId },
      relations: ['property', 'property.ward'],
    });
    if (!room) throw new NotFoundException(`Room #${dto.roomId} not found`);

    const owner = await this.userRepo.findOne({
      where: { id: dto.ownerUserId },
    });
    if (!owner)
      throw new NotFoundException(`User #${dto.ownerUserId} not found`);

    const cap = room.maxOccupancy;
    const peopleCount = 1 + dto.coTenants.length;
    if (cap != null && cap > 0 && peopleCount > cap) {
      throw new BadRequestException(
        `Room max occupancy is ${cap} (1 representative + ${dto.coTenants.length} co-tenants).`,
      );
    }

    const wardName =
      room.property?.ward?.name?.trim() ||
      `ward-${room.property?.ward?.id ?? '0'}`;

    const provisionedAccounts: ProvisionedAccount[] = [];
    const usedEmails = new Set<string>();

    const savedContract = await this.contractRepo.manager.transaction(
      async (mgr) => {
        const { user: repUser, plainPassword: repPass } =
          await this.provisionTenantUser(
            mgr,
            dto.representative,
            wardName,
            room.roomCode,
            usedEmails,
          );
        provisionedAccounts.push({
          kind: 'representative',
          userId: repUser.id,
          email: repUser.email,
          initialPassword: repPass,
        });

        const occupantEntities: ContractOccupant[] = [];

        for (const co of dto.coTenants) {
          const { user: u, plainPassword } = await this.provisionTenantUser(
            mgr,
            co,
            wardName,
            room.roomCode,
            usedEmails,
          );
          provisionedAccounts.push({
            kind: 'co_tenant',
            userId: u.id,
            email: u.email,
            initialPassword: plainPassword,
          });
          occupantEntities.push(mgr.create(ContractOccupant, { user: u }));
        }

        const contractRow = mgr.create(Contract, {
          contractNo: dto.contractNo,
          startDate: dto.startDate,
          endDate: dto.endDate ?? null,
          monthlyRent: dto.monthlyRent,
          depositAmount: dto.depositAmount,
          status: dto.status,
          documentUrl: dto.documentUrl ?? null,
          terminationReason: dto.terminationReason ?? null,
          room: { id: dto.roomId } as Room,
          tenant: repUser,
          owner: { id: dto.ownerUserId } as User,
        });
        const saved = await mgr.save(contractRow);
        for (const row of occupantEntities) {
          row.contract = saved;
        }
        await mgr.save(occupantEntities);
        return saved;
      },
    );

    const contract = await this.findOne(savedContract.id);
    return { contract, provisionedAccounts };
  }

  findAll() {
    return this.contractRepo.find({
      order: { id: 'ASC' },
      relations: [...contractRelations],
    });
  }

  async findOne(id: string) {
    const row = await this.contractRepo.findOne({
      where: { id },
      relations: [...contractRelations],
    });
    if (!row) throw new NotFoundException(`Contract #${id} not found`);
    return row;
  }

  async update(id: string, dto: UpdateContractDto) {
    const c = await this.findOne(id);
    const nextRoomId = dto.roomId ?? c.room.id;
    const nextTenantId = dto.tenantUserId ?? c.tenant.id;
    const nextOwnerId = dto.ownerUserId ?? c.owner.id;

    const room = await this.roomRepo.findOne({ where: { id: nextRoomId } });
    if (!room) throw new NotFoundException(`Room #${nextRoomId} not found`);

    const occupantIdsForValidation =
      dto.occupantUserIds !== undefined
        ? dto.occupantUserIds
        : (c.occupants
            ?.map((o) => o.user?.id)
            .filter((id): id is string => id != null) ?? []);

    if (
      dto.roomId !== undefined ||
      dto.tenantUserId !== undefined ||
      dto.ownerUserId !== undefined ||
      dto.occupantUserIds !== undefined
    ) {
      await this.assertFk(nextRoomId, nextTenantId, nextOwnerId);
      await this.validateOccupants(
        room,
        nextTenantId,
        occupantIdsForValidation,
      );
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

    await this.contractRepo.save(c);

    if (dto.occupantUserIds !== undefined) {
      await this.replaceOccupants(c.id, dto.occupantUserIds);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.contractRepo.delete(id);
  }
}
