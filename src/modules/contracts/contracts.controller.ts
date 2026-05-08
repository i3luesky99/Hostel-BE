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
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@ApiTags('contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hợp đồng' })
  create(@Body() dto: CreateContractDto) {
    return this.contractsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách hợp đồng' })
  findAll() {
    return this.contractsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết hợp đồng' })
  findOne(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật hợp đồng' })
  update(
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdateContractDto,
  ) {
    return this.contractsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hợp đồng' })
  remove(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.contractsService.remove(id);
  }
}
