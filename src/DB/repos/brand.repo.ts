import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database.repository';
import { HBrandDocument, Brand } from '../Models/brand.model';

@Injectable()
export class BrandRepository extends BaseRepository<HBrandDocument> {
  constructor(
    @InjectModel(Brand.name)
    protected override readonly model: Model<HBrandDocument>,
  ) {
    super(model);
  }
}
