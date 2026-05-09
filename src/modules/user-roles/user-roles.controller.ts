import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ParseBigIntIdPipe } from '../../common/pipes/parse-bigint-id.pipe';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRolesService } from './user-roles.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('user-roles')
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  @ApiOperation({ summary: 'Gán role cho user' })
  create(@Body() dto: CreateUserRoleDto) {
    return this.userRolesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách role' })
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    return this.userRolesService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một bản ghi role' })
  findOne(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.userRolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật role' })
  update(
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.userRolesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa role' })
  remove(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.userRolesService.remove(id);
  }
}
