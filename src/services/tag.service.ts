import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from '../schemas/tag.schema';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async create(organizationId: number, name: string): Promise<Tag> {
    const createdTag = new this.tagModel({
      organizationId,
      name,
    });
    return createdTag.save();
  }

  async findAll(organizationId: number, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.tagModel
        .find({ organizationId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.tagModel.countDocuments({ organizationId }).exec(),
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
}
