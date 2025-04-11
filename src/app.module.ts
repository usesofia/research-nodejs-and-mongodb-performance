import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagController } from './controllers/tag.controller';
import { FinancialRecordController } from './controllers/financial-record.controller';
import { TagService } from './services/tag.service';
import { FinancialRecordService } from './services/financial-record.service';
import { Tag, TagSchema } from './schemas/tag.schema';
import {
  FinancialRecord,
  FinancialRecordSchema,
} from './schemas/financial-record.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/financial_db',
    ),
    MongooseModule.forFeature([
      { name: Tag.name, schema: TagSchema },
      { name: FinancialRecord.name, schema: FinancialRecordSchema },
    ]),
  ],
  controllers: [AppController, TagController, FinancialRecordController],
  providers: [AppService, TagService, FinancialRecordService],
})
export class AppModule {}
