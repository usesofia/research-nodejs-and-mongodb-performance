import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { mongoosePaginatePlugin } from '../plugins/mongoose-paginate.plugin';

export type TagDocument = Tag & Document;

@Schema({
  timestamps: true,
})
export class Tag {
  @Prop({ required: true })
  organizationId: number;

  @Prop({ required: true })
  name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

// Add the pagination plugin
TagSchema.plugin(mongoosePaginatePlugin);
