import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AppRole } from '../../entities/enums';
import { UserRole } from '../../entities/user-role.entity';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userPublicSelect = {
  id: true,
  email: true,
  fullName: true,
  phone: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserPublicView = {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: User['status'];
  createdAt: Date;
  updatedAt: Date;
  roles: AppRole[];
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private dedupeRoles(roles: AppRole[]): AppRole[] {
    return [...new Set(roles)];
  }

  private mapPublic(user: User): UserPublicView {
    const roles =
      user.userRoles?.map((ur) => ur.role as AppRole) ?? ([] as AppRole[]);
    const ordered = this.dedupeRoles(roles);
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: ordered,
    };
  }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const row = this.userRepo.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone ?? null,
      status: dto.status,
    });

    const saved = await this.userRepo.manager.transaction(async (mgr) => {
      const u = await mgr.save(User, row);
      const unique = this.dedupeRoles(dto.roles);
      await mgr.save(
        UserRole,
        unique.map((role) => mgr.create(UserRole, { role, user: u })),
      );
      return u;
    });

    return this.findOnePublic(saved.id);
  }

  async findAll(): Promise<UserPublicView[]> {
    const rows = await this.userRepo.find({
      select: userPublicSelect,
      relations: ['userRoles'],
      order: { id: 'ASC' },
    });
    return rows.map((u) => this.mapPublic(u));
  }

  async findOnePublic(id: string): Promise<UserPublicView> {
    const row = await this.userRepo.findOne({
      where: { id },
      select: userPublicSelect,
      relations: ['userRoles'],
    });
    if (!row) throw new NotFoundException(`User #${id} not found`);
    return this.mapPublic(row);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User #${id} not found`);
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.fullName !== undefined) user.fullName = dto.fullName;
    if (dto.phone !== undefined) user.phone = dto.phone ?? null;
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.password !== undefined) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    await this.userRepo.manager.transaction(async (mgr) => {
      await mgr.save(User, user);
      if (dto.roles !== undefined) {
        await mgr.delete(UserRole, { user: { id } as User });
        const unique = this.dedupeRoles(dto.roles);
        if (unique.length) {
          await mgr.save(
            UserRole,
            unique.map((role) =>
              mgr.create(UserRole, { role, user: { id } as User }),
            ),
          );
        }
      }
    });

    return this.findOnePublic(id);
  }

  async remove(id: string) {
    const ok = await this.userRepo.exist({ where: { id } });
    if (!ok) throw new NotFoundException(`User #${id} not found`);
    await this.userRepo.delete(id);
  }
}
