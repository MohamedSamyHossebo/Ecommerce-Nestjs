import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Coupon {
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code!: string;

  @Prop({ required: true, type: Number, min: 1, max: 100 })
  discountPercentage!: number;

  @Prop({ required: true, type: Date })
  expireDate!: Date;

  @Prop({ required: true, type: Number, min: 1 })
  maxUsage!: number;

  @Prop({ type: Number, min: 0, default: 0 })
  usedCount!: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  usedBy!: mongoose.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy!: mongoose.Types.ObjectId;
}
export const CouponSchema = SchemaFactory.createForClass(Coupon);
export type HCouponDocument = HydratedDocument<Coupon>;
export const CouponModel = MongooseModule.forFeature([
  { name: Coupon.name, schema: CouponSchema },
]);
