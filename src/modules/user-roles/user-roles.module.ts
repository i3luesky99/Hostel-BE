import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from '../../entities/user-role.entity';
import { User } from '../../entities/user.entity';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, User])],
  controllers: [UserRolesController],
  providers: [UserRolesService],
})
export class UserRolesModule {}
