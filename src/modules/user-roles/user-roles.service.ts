import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../entities/user-role.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly roleRepo: Repository<UserRole>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserRoleDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`User #${dto.userId} not found`);
    const row = this.roleRepo.create({
      role: dto.role,
      user: { id: dto.userId } as User,
    });
    return this.roleRepo.save(row);
  }

  findAll(userId?: string) {
    return this.roleRepo.find({
      where: userId ? { user: { id: userId } } : {},
      order: { id: 'ASC' },
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const row = await this.roleRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!row) throw new NotFoundException(`User role #${id} not found`);
    return row;
  }

  async update(id: string, dto: UpdateUserRoleDto) {
    const ur = await this.findOne(id);
    if (dto.role !== undefined) ur.role = dto.role;
    if (dto.userId !== undefined) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) throw new NotFoundException(`User #${dto.userId} not found`);
      ur.user = user;
    }
    return this.roleRepo.save(ur);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.roleRepo.delete(id);
  }
}
