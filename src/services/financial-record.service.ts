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

    const result = await this.recordModel.aggregate([
      // Match records for the organization and date range
      {
        $match: {
          organizationId,
          dueDate: { $gte: twoYearsAgo }
        }
      },
      // Group by year and month
      {
        $group: {
          _id: {
            year: { $year: "$dueDate" },
            month: { $month: "$dueDate" }
          },
          in: {
            $sum: {
              $cond: [
                { $eq: ["$direction", "IN"] },
                "$amount",
                0
              ]
            }
          },
          out: {
            $sum: {
              $cond: [
                { $eq: ["$direction", "OUT"] },
                "$amount",
                0
              ]
            }
          }
        }
      },
      // Project to match the expected output format
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          in: 1,
          out: 1
        }
      },
      // Sort by year and month
      {
        $sort: {
          year: 1,
          month: 1
        }
      }
    ]);

    return {
      monthlyData: result
    };
  }
}
