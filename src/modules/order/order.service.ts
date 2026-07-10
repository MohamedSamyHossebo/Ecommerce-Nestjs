import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from 'src/DB/repos/order.repo';
import { CartRepository } from 'src/DB/repos/cart.repo';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { HCouponDocument } from 'src/DB/Models/coupons.model';
import { CouponRepository } from 'src/DB/repos/coupons.repo';
import { OrderStatus } from 'src/common/enums/order.enum';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private cartRepo: CartRepository,
    private productRepo: ProductRepository,
    private couponeRepo: CouponRepository,
  ) {}
  async checkout(createOrderDto: CreateOrderDto, userId: string) {
    const cart = await this.cartRepo.findById(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    const orderItems: {
      product: string;
      qty: number;
      priceSnapshot: number;
    }[] = [];
    let calculatedSubTotal = 0;
    for (const item of cart.items) {
      const dbProduct = await this.productRepo.findById(item.product);
      if (!dbProduct) {
        throw new BadRequestException('Product not found');
      }
      if (dbProduct.stock < item.quantity) {
        throw new BadRequestException(
          `Product ${dbProduct.name} out of stock. Available: ${dbProduct.stock}, Requested: ${item.quantity}`,
        );
      }
      calculatedSubTotal += Number(dbProduct.price) * item.quantity;
      orderItems.push({
        product: item.product,
        qty: item.quantity,
        priceSnapshot: dbProduct.price,
      });
    }
    let discountAmount = 0;
    let targetCoupone: HCouponDocument | null = null;
    if (createOrderDto.couponCode) {
      targetCoupone = await this.couponeRepo.findOne({
        code: createOrderDto.couponCode,
      });
      if (!targetCoupone) {
        throw new BadRequestException('Coupon not found');
      }
      if (new Date() > targetCoupone.expireDate) {
        throw new BadRequestException('Coupon is expired');
      }
      if (targetCoupone.usedCount >= targetCoupone.maxUsage) {
        throw new BadRequestException('Coupon is used');
      }
      if (targetCoupone.usedBy.map((id) => id.toString()).includes(userId)) {
        throw new BadRequestException('Coupon is already used by you');
      }
      discountAmount =
        (calculatedSubTotal * targetCoupone.discountPercentage) / 100;
    }
    const finalPrice = calculatedSubTotal - discountAmount;
    for (const item of orderItems) {
      await this.productRepo.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }
    if (targetCoupone) {
      await this.couponeRepo.findByIdAndUpdate(targetCoupone._id.toString(), {
        $inc: { usedCount: 1 },
        $push: { usedBy: userId },
      });
    }

    // Create Order
    const order = await this.orderRepo.create({
      user: userId,
      items: orderItems,
      subTotal: calculatedSubTotal,
      discountAmount,
      finalPrice,
      shippingAddress: createOrderDto.shippingAddress,
      appliedCoupon: targetCoupone?._id || null,
      status: OrderStatus.PENDING,
    });
    await order.save();

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    return order;
  }
}
