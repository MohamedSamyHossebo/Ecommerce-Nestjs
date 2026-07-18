import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
@ObjectType()
@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Coupon {
  @Field(() => String)
  @Prop()
  _id!: mongoose.Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true, unique: true, trim: true, uppercase: true })
  code!: string;

  @Field(() => Int)
  @Prop({ required: true, type: Number, min: 1, max: 100 })
  discountPercentage!: number;

  @Field(() => String)
  @Prop({ required: true, type: Date })
  expireDate!: Date;

  @Field(() => Int)
  @Prop({ required: true, type: Number, min: 1 })
  maxUsage!: number;

  @Field(() => Int)
  @Prop({ type: Number, min: 0, default: 0 })
  usedCount!: number;

  @Field(() => [ID])
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  usedBy!: mongoose.Types.ObjectId[];

  @Field(() => ID)
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
