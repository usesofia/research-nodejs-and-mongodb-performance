import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Tag } from './tag.schema';
import { mongoosePaginatePlugin } from '../plugins/mongoose-paginate.plugin';

export type FinancialRecordDocument = FinancialRecord & Document;

@Schema({
  timestamps: true,
})
export class FinancialRecord {
  @Prop({ required: true })
  organizationId: number;

  @Prop({ required: true, enum: ['IN', 'OUT'] })
  direction: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tag' }] })
  tags: Tag[];
}

export const FinancialRecordSchema =
  SchemaFactory.createForClass(FinancialRecord);

// Add the pagination plugin
FinancialRecordSchema.plugin(mongoosePaginatePlugin);
