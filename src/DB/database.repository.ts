import { PaginationDto } from './../common/dto/pagination.dto';
import {
  type Document,
  type Model,
  type UpdateQuery,
  type QueryOptions,
  type QueryFilter,
  type PopulateOptions,
} from 'mongoose';

type FilterQuery<T> = QueryFilter<T>;

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findOne(
    filter: FilterQuery<T> = {},
    select: string = '',
    options: QueryOptions = {},
  ): Promise<T | null> {
    const doc = this.model.findOne(filter);

    if (select) doc.select(select);
    if (options.populate)
      doc.populate(
        options.populate as PopulateOptions | (string | PopulateOptions)[],
      );
    if (options.lean) doc.lean();

    return await doc.exec();
  }

  async findById(
    id: string,
    select: string = '',
    options: QueryOptions = {},
  ): Promise<T | null> {
    const doc = this.model.findById(id);

    if (select) doc.select(select);
    if (options.populate)
      doc.populate(
        options.populate as PopulateOptions | (string | PopulateOptions)[],
      );
    if (options.lean) doc.lean();

    return await doc.exec();
  }

  async find(
    filter: FilterQuery<T> = {},
    select: string = '',
    options: QueryOptions = {},
  ): Promise<T[]> {
    const doc = this.model.find(filter).select(select || '');

    if (options.populate)
      doc.populate(
        options.populate as PopulateOptions | (string | PopulateOptions)[],
      );
    if (options.lean) doc.lean();
    if (options.limit) doc.limit(options.limit);
    if (options.skip) doc.skip(options.skip);

    return await doc.exec();
  }

  async insertMany(data: any[]): Promise<T[]> {
    return (await this.model.insertMany(data)) as unknown as T[];
  }

  async create(
    data: any,
    options: any = { validateBeforeSave: true },
  ): Promise<T> {
    const docs = await this.model.create([data], options);
    return docs[0] as T;
  }

  async updateOne(
    filter: FilterQuery<T> = {},
    update: UpdateQuery<T>,
    options: QueryOptions = {},
  ) {
    return await this.model.updateOne(
      filter,
      { ...update, $inc: { __v: 1 } },
      options as any,
    );
  }

  async findOneAndUpdate(
    filter: FilterQuery<T> = {},
    update: UpdateQuery<T>,
    options: QueryOptions = {},
  ): Promise<T | null> {
    return await this.model.findOneAndUpdate(
      filter,
      { ...update, $inc: { __v: 1 } },
      { new: true, runValidators: true, ...options },
    );
  }

  async findByIdAndUpdate(
    id: string,
    update: UpdateQuery<T>,
    options: QueryOptions = {},
  ): Promise<T | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { ...update, $inc: { __v: 1 } },
      { new: true, runValidators: true, ...options },
    );
  }

  async deleteOne(filter: FilterQuery<T> = {}) {
    return await this.model.deleteOne(filter);
  }

  async deleteMany(filter: FilterQuery<T> = {}) {
    return await this.model.deleteMany(filter);
  }

  async findOneAndDelete(filter: FilterQuery<T> = {}): Promise<T | null> {
    return await this.model.findOneAndDelete(filter);
  }
  async paginate(
    filter: FilterQuery<T> = {},
    options: PaginationDto & { populate?: any },
  ) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.model.find(filter).skip(skip).limit(limit);

    if (options.populate) {
      query.populate(options.populate);
    }

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return {
      data,
      total,
      page,
      limit,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
      totalPages: Math.ceil(total / limit),
    };
  }
}
