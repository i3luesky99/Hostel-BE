import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const row = this.userRepo.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone ?? null,
      status: dto.status,
    });
    const saved = await this.userRepo.save(row);
    return this.findOnePublic(saved.id);
  }

  findAll() {
    return this.userRepo.find({
      select: userPublicSelect,
      order: { id: 'ASC' },
    });
  }

  async findOnePublic(id: string) {
    const row = await this.userRepo.findOne({
      where: { id },
      select: userPublicSelect,
    });
    if (!row) throw new NotFoundException(`User #${id} not found`);
    return row;
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
    await this.userRepo.save(user);
    return this.findOnePublic(id);
  }

  async remove(id: string) {
    const ok = await this.userRepo.exist({ where: { id } });
    if (!ok) throw new NotFoundException(`User #${id} not found`);
    await this.userRepo.delete(id);
  }
}
