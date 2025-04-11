import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FinancialRecordService } from '../services/financial-record.service';
import {
  CreateFinancialRecordDto,
  CreateFinancialRecordBulkDto,
} from '../dto/financial-record.dto';

@Controller('organizations/:organizationId/financial-records')
export class FinancialRecordController {
  constructor(
    private readonly financialRecordService: FinancialRecordService,
  ) {}

  @Post()
  async create(
    @Param('organizationId') organizationId: string,
    @Body() createRecordDto: CreateFinancialRecordDto,
  ) {
    return this.financialRecordService.create(
      Number(organizationId),
      createRecordDto,
    );
  }

  @Post('bulk')
  async createBulk(
    @Param('organizationId') organizationId: string,
    @Body() bulkDto: CreateFinancialRecordBulkDto,
  ) {
    return this.financialRecordService.createBulk(
      Number(organizationId),
      bulkDto.records,
    );
  }

  @Get()
  async findAll(
    @Param('organizationId') organizationId: string,
    @Query('page') page: string = '1',
    @Query('page_size') pageSize: string = '20',
    @Query('tags') tags?: string,
  ) {
    let tagIds: string[] | undefined;

    if (tags) {
      tagIds = tags.split(',');
    }

    return this.financialRecordService.findAll(
      Number(organizationId),
      Number(page),
      Number(pageSize),
      tagIds,
    );
  }

  @Get('reports/cash-flow')
  async getCashFlowReport(@Param('organizationId') organizationId: string) {
    return this.financialRecordService.getCashFlowReport(
      Number(organizationId),
    );
  }
}
