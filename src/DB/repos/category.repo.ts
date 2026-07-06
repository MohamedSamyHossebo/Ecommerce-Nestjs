import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database.repository';
import { HCategoryDocument, Category } from '../Models/category.model';

@Injectable()
export class CategoryRepository extends BaseRepository<HCategoryDocument> {
  constructor(
    @InjectModel(Category.name)
    protected override readonly model: Model<HCategoryDocument>,
  ) {
    super(model);
  }
}
