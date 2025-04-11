import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface PaginateOptions {
    page?: number;
    limit?: number;
    sort?: any;
  }

  interface PaginateResult<T> {
    data: T[];
    pagination: {
      current_page: number;
      page_size: number;
      total_items: number;
      total_pages: number;
    };
  }

  interface PaginateModel<T extends Document> extends Model<T> {
    paginate(
      query?: any,
      options?: PaginateOptions,
    ): Promise<PaginateResult<T>>;
  }
}
