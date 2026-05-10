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
import { CreateMeterReadingDto } from './dto/create-meter-reading.dto';
import { UpdateMeterReadingDto } from './dto/update-meter-reading.dto';
import { MeterReadingsService } from './meter-readings.service';

@ApiBearerAuth('JWT-auth')
@ApiTags('meter-readings')
@Controller('contracts/:contractId/meter-readings')
export class MeterReadingsController {
  constructor(private readonly meterReadingsService: MeterReadingsService) {}

  @Post()
  @ApiOperation({
    summary: 'Ghi chỉ số công tơ',
    description:
      'Nguồn sự thật: mỗi lần đọc số điện/nước ghi một dòng; so sánh tháng trước/này tính trên client hoặc khi lập billing_period.',
  })
  create(
    @Param('contractId', ParseBigIntIdPipe) contractId: string,
    @Body() dto: CreateMeterReadingDto,
  ) {
    return this.meterReadingsService.create(contractId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách chỉ số theo hợp đồng' })
  findAll(@Param('contractId', ParseBigIntIdPipe) contractId: string) {
    return this.meterReadingsService.findAll(contractId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết một lần ghi chỉ số' })
  findOne(
    @Param('contractId', ParseBigIntIdPipe) contractId: string,
    @Param('id', ParseBigIntIdPipe) id: string,
  ) {
    return this.meterReadingsService.findOne(contractId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Sửa lần ghi chỉ số' })
  update(
    @Param('contractId', ParseBigIntIdPipe) contractId: string,
    @Param('id', ParseBigIntIdPipe) id: string,
    @Body() dto: UpdateMeterReadingDto,
  ) {
    return this.meterReadingsService.update(contractId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa lần ghi chỉ số' })
  remove(
    @Param('contractId', ParseBigIntIdPipe) contractId: string,
    @Param('id', ParseBigIntIdPipe) id: string,
  ) {
    return this.meterReadingsService.remove(contractId, id);
  }
}
