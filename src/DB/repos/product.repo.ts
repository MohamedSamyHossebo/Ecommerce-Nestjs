import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database.repository';
import { HProductDocument, Product } from '../Models/product.model';

@Injectable()
export class ProductRepository extends BaseRepository<HProductDocument> {
  constructor(
    @InjectModel(Product.name)
    protected override readonly model: Model<HProductDocument>,
  ) {
    super(model);
  }
}
