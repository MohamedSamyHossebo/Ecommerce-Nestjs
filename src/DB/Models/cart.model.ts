import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Mongoose, type HydratedDocument } from 'mongoose';

@Schema({
  _id: false,
})
export class CartItems {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
  product!: string;

  @Prop({
    required: true,
    min: [1, `Quantity cannot be less than 1`],
    default: 1,
  })
  quantity!: number;

  @Prop({
    required: true,
    type: Number,
    min: [0, `Price cannot be less than 0`],
    default: 0,
  })
  pricePerUnit!: number;

  @Prop({
    required: true,
    type: Number,
    min: [0, `subTotal cannot be less than 0`],
    default: 0,
  })
  subTotal!: number;
}

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true })
  user!: string;

  @Prop({ type: [CartItems], default: [] })
  items!: CartItems[];

  @Prop({ default: 0 })
  totalPrice!: number;
    
  @Prop({ default: 0 })
  totalItems!: number;
}

export const cartSchema = SchemaFactory.createForClass(Cart);
export const cartItemSchema = SchemaFactory.createForClass(CartItems);
export type HCartDocument = HydratedDocument<Cart>;
export type HCartItemDocument = HydratedDocument<CartItems>;
export const cartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: cartSchema },
]);
export const cartItemsModel = MongooseModule.forFeature([
  { name: CartItems.name, schema: cartItemSchema },
]);
