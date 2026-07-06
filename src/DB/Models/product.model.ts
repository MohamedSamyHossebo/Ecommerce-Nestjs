import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class Product {
  @Prop({ type: String, required: true, trim: true, unique: true })
  name!: string;
  @Prop({ type: String, trim: true })
  description?: string;

  @Prop([{ type: String, required: true }])
  images!: string[];

  @Prop({ type: Number, required: true })
  price!: number;

  @Prop({ type: Number, required: true })
  stock!: number;

  @Prop({ type: String, trim: true })
  overview!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  })
  category!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Brand',
  })
  brand!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy!: string;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
export type HProductDocument = HydratedDocument<Product>;
export const ProductModel = MongooseModule.forFeature([
  {
    name: Product.name,
    schema: ProductSchema,
  },
]);
