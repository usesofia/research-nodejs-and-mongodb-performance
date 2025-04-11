import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FinancialRecord,
  FinancialRecordDocument,
} from '../schemas/financial-record.schema';
import { CashFlowReportDto, MonthlyCashFlowDto } from '../dto/cash-flow.dto';
import { CreateFinancialRecordDto } from '../dto/financial-record.dto';

@Injectable()
export class FinancialRecordService {
  constructor(
    @InjectModel(FinancialRecord.name)
    private recordModel: Model<FinancialRecordDocument>,
  ) {}

  async create(
    organizationId: number,
    recordDto: CreateFinancialRecordDto,
  ): Promise<FinancialRecord> {
    const createdRecord = new this.recordModel({
      organizationId,
      direction: recordDto.direction,
      amount: recordDto.amount,
      dueDate: recordDto.dueDate,
      tags: recordDto.tags || [],
    });
    return createdRecord.save();
  }

  async createBulk(
    organizationId: number,
    recordsDto: CreateFinancialRecordDto[],
  ): Promise<any> {
    const recordsWithOrgId = recordsDto.map((recordDto) => ({
      organizationId,
      direction: recordDto.direction,
      amount: recordDto.amount,
      dueDate: recordDto.dueDate,
      tags: recordDto.tags || [],
    }));
    return this.recordModel.insertMany(recordsWithOrgId);
  }

  async findAll(
    organizationId: number,
    page = 1,
    pageSize = 20,
    tagIds?: string[],
  ) {
    const skip = (page - 1) * pageSize;

    const query: any = { organizationId };

    if (tagIds && tagIds.length > 0) {
      query.tags = { $in: tagIds };
    }

    const [data, total] = await Promise.all([
      this.recordModel
        .find(query)
        .populate('tags')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.recordModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      pagination: {
        current_page: page,
        page_size: pageSize,
        total_items: total,
        total_pages: totalPages,
      },
    };
  }

  async getCashFlowReport(organizationId: number): Promise<CashFlowReportDto> {
    // Calculate date range (last 2 years)
    const now = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(now.getFullYear() - 2);

    const records = await this.recordModel
      .find({
        organizationId,
        dueDate: { $gte: twoYearsAgo },
      })
      .exec();

    // Group records by year and month
    const monthlyData: { [key: string]: MonthlyCashFlowDto } = {};

    records.forEach((record) => {
      const date = new Date(record.dueDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // MongoDB months are 1-12
      const key = `${year}-${month}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          year,
          month,
          in: 0,
          out: 0,
        };
      }

      if (record.direction === 'IN') {
        monthlyData[key].in += record.amount;
      } else {
        monthlyData[key].out += record.amount;
      }
    });

    // Convert to array and sort
    const result = Object.values(monthlyData).sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    return {
      monthlyData: result,
    };
  }
}
