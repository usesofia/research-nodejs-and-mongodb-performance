import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

enum Direction {
  IN = 'IN',
  OUT = 'OUT',
}

export class CreateFinancialRecordDto {
  @IsNotEmpty()
  @IsEnum(Direction)
  direction: Direction;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tags?: string[];
}

export class CreateFinancialRecordBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFinancialRecordDto)
  records: CreateFinancialRecordDto[];
}
