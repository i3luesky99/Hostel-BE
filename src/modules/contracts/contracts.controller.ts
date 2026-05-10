import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseBigIntIdPipe } from '../../common/pipes/parse-bigint-id.pipe';
import {
  contractForApi,
  createContractResponse,
} from './contract-for-api.mapper';
import { ContractsService } from './contracts.service';
import {
  ContractCoTenantDto,
  ContractRepresentativeDto,
} from './dto/contract-party.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@ApiBearerAuth('JWT-auth')
@ApiExtraModels(ContractRepresentativeDto, ContractCoTenantDto)
@ApiTags('contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo hợp đồng + tài khoản tenant',
    description:
      'Đại diện (`representative`) và mỗi phần tử `coTenants` đều tạo user tenant: có email thì dùng, không thì email sinh `{ward-slug}-{roomCode}-{INITIALS}@domain`. `coTenants` bắt buộc ≥1. Response có `provisionedAccounts` (mật khẩu chỉ trả một lần).',
  })
  async create(@Body() dto: CreateContractDto) {
    const result = await this.contractsService.create(dto);
    return createContractResponse(result);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách hợp đồng' })
  async findAll() {
    const rows = await this.contractsService.findAll();
    return rows.map(contractForApi);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết hợp đồng' })
  async findOne(@Param('id', ParseBigIntIdPipe) id: string) {
    const row = await this.contractsService.findOne(id);
    return contractForApi(row);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật hợp đồng',
    description:
      'Gửi occupantUserIds để thay toàn bộ người ở cùng; [] để xóa hết. Không gửi = giữ danh sách cũ.',
  })
  async update(
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdateContractDto,
  ) {
    const row = await this.contractsService.update(id, dto);
    return contractForApi(row);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa hợp đồng' })
  remove(@Param('id', ParseBigIntIdPipe) id: string) {
    return this.contractsService.remove(id);
  }
}
