import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database.repository';
import { HCartDocument, Cart } from '../Models/cart.model';

@Injectable()
export class CartRepository extends BaseRepository<HCartDocument> {
  constructor(
    @InjectModel(Cart.name)
    protected override readonly model: Model<HCartDocument>,
  ) {
    super(model);
  }
}
