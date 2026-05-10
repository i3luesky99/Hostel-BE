import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParseBigIntIdPipe } from '../../common/pipes/parse-bigint-id.pipe';
import { BillingPeriodsService } from './billing-periods.service';
import { CreateBillingPeriodDto } from './dto/create-billing-period.dto';
import { UpdateBillingPeriodDto } from './dto/update-billing-period.dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('billing-periods')
@Controller('contracts/:contractId/billing-periods')
export class BillingPeriodsController {
  constructor(private readonly billingPeriodsService: BillingPeriodsService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo kỳ thanh toán (nháp hoặc đã điền số)',
    description:
      'Bản chốt sổ theo tháng (year/month). Trùng contract + kỳ → 409. Chuyển status sang finalized sẽ gắn finalized_at.',
  })
  create(
    @Param('contractId', ParseBigIntIdPipe) contractId: string,
    @Body() dto: CreateBillingPeriodDto,
  ) {
    return this.billingPeriodsService.create(contractId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách kỳ thanh toán theo hợp đồng' })
  findAll(@Param('contractId', ParseBigIntIdPipe) contractId: string) {
    return this.billingPeriodsService.findAll(contractId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một kỳ' })
  findOne(
    @Param('contractId', ParseBigIntIdPipe) contractId: string,
    @Param('id', ParseBigIntIdPipe) id: string,
  ) {
    return this.billingPeriodsService.findOne(contractId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật kỳ (tiền, chỉ số chốt, trạng thái)' })
  update(
    @Param('contractId', ParseBigIntIdPipe) contractId: string,
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdateBillingPeriodDto,
  ) {
    return this.billingPeriodsService.update(contractId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa kỳ (chỉ khi cần sửa nhầm)' })
  remove(
    @Param('contractId', ParseBigIntIdPipe) contractId: string,
    @Param('id', ParseBigIntIdPipe) id: string,
  ) {
    return this.billingPeriodsService.remove(contractId, id);
  }
}
