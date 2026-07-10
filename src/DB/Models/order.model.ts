import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { OrderStatus } from 'src/common/enums/order.enum';

@Schema({
  _id: false,
})
class OrderItem {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  })
  product!: string;
  @Prop({ type: Number, required: true })
  qty!: number;

  @Prop({ type: Number, required: true })
  priceSnapshot!: number;
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Order {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  user!: string;

  @Prop({
    type: [OrderItem],
    required: true,
  })
  items!: OrderItem[];

  @Prop({
    type: Number,
    required: true,
  })
  subTotal!: number;

  @Prop({ type: Number, default: 0 })
  discountAmount?: number;

  @Prop({ type: Number, required: true })
  totalPrice!: number;

  @Prop({
    type: String,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: string;

  @Prop({
    type: String,
    required: true,
  })
  shippingAddress!: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
  })
  appliedCoupon?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
export type HOrderDocument = HydratedDocument<Order>;

export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema },
]);
