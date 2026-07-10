import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from '../database.repository';
import { Coupon, HCouponDocument } from '../Models/coupons.model';

@Injectable()
export class CouponRepository extends BaseRepository<HCouponDocument> {
  constructor(
    @InjectModel(Coupon.name)
    protected override readonly model: Model<HCouponDocument>,
  ) {
    super(model);
  }
}
