import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantProfile } from '../../entities/tenant-profile.entity';
import { User } from '../../entities/user.entity';
import { CreateTenantProfileDto } from './dto/create-tenant-profile.dto';
import { UpdateTenantProfileDto } from './dto/update-tenant-profile.dto';

@Injectable()
export class TenantProfilesService {
  constructor(
    @InjectRepository(TenantProfile)
    private readonly profileRepo: Repository<TenantProfile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateTenantProfileDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User #${dto.userId} not found`);
    const exists = await this.profileRepo.findOne({
      where: { userId: dto.userId },
    });
    if (exists)
      throw new ConflictException(
        'Tenant profile already exists for this user',
      );
    const dupCitizen = await this.profileRepo.findOne({
      where: { citizenId: dto.citizenId },
    });
    if (dupCitizen)
      throw new ConflictException('Citizen ID already registered');

    const row = this.profileRepo.create({
      user: { id: dto.userId } as User,
      citizenId: dto.citizenId,
      photoUrl: dto.photoUrl ?? null,
      citizenIdIssueDate: dto.citizenIdIssueDate
        ? new Date(dto.citizenIdIssueDate)
        : null,
      citizenIdIssuePlace: dto.citizenIdIssuePlace ?? null,
      citizenIdFrontUrl: dto.citizenIdFrontUrl ?? null,
      citizenIdBackUrl: dto.citizenIdBackUrl ?? null,
    });
    return this.profileRepo.save(row);
  }

  findAll() {
    return this.profileRepo.find({
      order: { userId: 'ASC' },
      relations: ['user'],
    });
  }

  async findOne(userId: string) {
    const row = await this.profileRepo.findOne({
      where: { userId },
      relations: ['user'],
    });
    if (!row)
      throw new NotFoundException(
        `Tenant profile for user #${userId} not found`,
      );
    return row;
  }

  async update(userId: string, dto: UpdateTenantProfileDto) {
    const profile = await this.findOne(userId);
    if (dto.citizenId !== undefined && dto.citizenId !== profile.citizenId) {
      const dup = await this.profileRepo.findOne({
        where: { citizenId: dto.citizenId },
      });
      if (dup && dup.userId !== userId)
        throw new ConflictException('Citizen ID already registered');
      profile.citizenId = dto.citizenId;
    }
    if (dto.photoUrl !== undefined) profile.photoUrl = dto.photoUrl ?? null;
    if (dto.citizenIdIssueDate !== undefined)
      profile.citizenIdIssueDate = dto.citizenIdIssueDate
        ? new Date(dto.citizenIdIssueDate)
        : null;
    if (dto.citizenIdIssuePlace !== undefined)
      profile.citizenIdIssuePlace = dto.citizenIdIssuePlace ?? null;
    if (dto.citizenIdFrontUrl !== undefined)
      profile.citizenIdFrontUrl = dto.citizenIdFrontUrl ?? null;
    if (dto.citizenIdBackUrl !== undefined)
      profile.citizenIdBackUrl = dto.citizenIdBackUrl ?? null;
    return this.profileRepo.save(profile);
  }

  async remove(userId: string) {
    await this.findOne(userId);
    await this.profileRepo.delete({ userId });
  }
}
