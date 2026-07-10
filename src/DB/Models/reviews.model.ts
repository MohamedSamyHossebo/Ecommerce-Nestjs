import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class Review {
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: string;
  @Prop({
    type: Number,
    required: true,
    max: 5,
    min: 1,
  })
  rating!: number;
  @Prop({
    type: String,
    required: true,
    minLength: 5,
    maxLength: 300,
  })
  comment!: string;
  @Prop({
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId!: string;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
export type HReviewDocument = HydratedDocument<Review>;
export const ReviewsModel = MongooseModule.forFeature([
  {
    name: Review.name,
    schema: ReviewSchema,
  },
]);
