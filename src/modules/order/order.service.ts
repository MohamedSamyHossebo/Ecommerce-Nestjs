import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from 'src/DB/repos/order.repo';
import { CartRepository } from 'src/DB/repos/cart.repo';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { HCouponDocument } from 'src/DB/Models/coupons.model';
import { CouponRepository } from 'src/DB/repos/coupons.repo';
import { OrderStatus } from 'src/common/enums/order.enum';
import { SocketService } from 'src/socket/socket.service';
import { PaymentService } from 'src/common/services/payment/payment.service';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private cartRepo: CartRepository,
    private productRepo: ProductRepository,
    private couponeRepo: CouponRepository,
    private _socketService: SocketService,
    private paymentService: PaymentService,
  ) {}
  async checkout(createOrderDto: CreateOrderDto, userId: string) {
    const cart = await this.cartRepo.findOne({ user: userId });
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
      const updatedPrdouct = await this.productRepo.findByIdAndUpdate(
        item.product,
        {
          $inc: { stock: -item.qty },
        },
      );

      if (updatedPrdouct) {
        if (updatedPrdouct.stock <= 5 && updatedPrdouct.stock > 0) {
          this._socketService.emitToRoom('Admins', 'LowStock', {
            productId: updatedPrdouct._id,
            productName: updatedPrdouct.name,
            stock: updatedPrdouct.stock,
            message: `Only ${updatedPrdouct.stock} Items Left`,
          });
          console.log(`${updatedPrdouct.name} is now Out of Stock`);
        }
        if (updatedPrdouct.stock === 0) {
          this._socketService.emitToAll('StockOut', {
            productId: updatedPrdouct._id,
            productName: updatedPrdouct.name,
            stock: updatedPrdouct.stock,
            message: `${updatedPrdouct.name} is now Out of Stock`,
          });
        }
      }
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
      totalPrice: finalPrice,
      shippingAddress: createOrderDto.shippingAddress,
      appliedCoupon: targetCoupone?._id || null,
      status: OrderStatus.PENDING,
    });
    await order.populate('user');
    const amount = order.totalPrice ?? order.subTotal ?? 0;
    const line_items = [
      {
        price_data: {
          currency: 'egp',
          product_data: {
            name: `Order By ${(order.user as any)?.firstName} ${(order.user as any)?.lastName}`,
            description: `Order Address ${JSON.stringify(order.shippingAddress)}`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ];
    const session = await this.paymentService.checkoutSetion({
      customer_email: (order.user as any)?.email,
      line_items: line_items,
      success_url: process.env.SUCCESS_URL! as string,
      cancel_url: process.env.CANCEL_URL! as string,
      mode: 'payment',
      discounts: [],
      metadata: { orderId: order._id.toString() },
    });
    (order as any).paymentSession = session.url;
    await order.save();

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    return { session: session.url, order };
  }

  async getMyOrders(userId: string) {
    return this.orderRepo.find({ user: userId });
  }

  async getOrderById(orderId: string, userId: string) {
    const order = await this.orderRepo.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderRepo.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Cannot cancel order in ${order.status} status`,
      );
    }

    order.status = OrderStatus.CANCELLED;

    // Restock products
    for (const item of order.items) {
      await this.productRepo.findByIdAndUpdate(item.product, {
        $inc: { stock: item.qty },
      });
    }

    await order.save();
    return order;
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.paymentService.constructWebhookEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string,

      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) return;
      await this.orderRepo.findByIdAndUpdate(orderId, {
        status: OrderStatus.PAID,
      });
    }
  }
}
