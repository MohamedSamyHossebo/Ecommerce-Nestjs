import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Brand {
  @Prop({ type: String, required: true, trim: true, unique: true })
  name!: string;
  @Prop({ type: String, required: true })
  logo!: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: 'Category',
  })
  categories!: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy!: string;
}
export const BrandSchema = SchemaFactory.createForClass(Brand);
export type HBrandModel = HydratedDocument<Brand>;
export const BrandModel = MongooseModule.forFeature([
  {
    name: Brand.name,
    schema: BrandSchema,
  },
]);
