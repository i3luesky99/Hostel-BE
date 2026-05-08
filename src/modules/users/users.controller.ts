import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseBigIntIdPipe } from '../../common/pipes/parse-bigint-id.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo người dùng' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách người dùng (không trả password)' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết người dùng' })
  findOne(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.usersService.findOnePublic(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật người dùng' })
  update(
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng' })
  remove(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.usersService.remove(id);
  }
}
