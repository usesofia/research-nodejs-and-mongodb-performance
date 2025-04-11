import { Schema } from 'mongoose';

export function mongoosePaginatePlugin(schema: Schema) {
  schema.statics.paginate = async function (query, options) {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.find(query).sort(sort).skip(skip).limit(limit).exec(),
      this.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        current_page: page,
        page_size: limit,
        total_items: total,
        total_pages: totalPages,
      },
    };
  };
}
