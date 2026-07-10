import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database.repository';
import { HOrderDocument, Order } from '../Models/order.model';

@Injectable()
export class OrderRepository extends BaseRepository<HOrderDocument> {
  constructor(
    @InjectModel(Order.name)
    protected override readonly model: Model<HOrderDocument>,
  ) {
    super(model);
  }
}
