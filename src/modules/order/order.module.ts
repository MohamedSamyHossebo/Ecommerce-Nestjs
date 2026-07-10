import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TokenModule } from 'src/common/modules/token/token.module';
import { OrderRepository } from 'src/DB/repos/order.repo';
import { OrderModel } from 'src/DB/Models/order.model';
import { CartRepository } from 'src/DB/repos/cart.repo';
import { cartModel } from 'src/DB/Models/cart.model';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { ProductModel } from 'src/DB/Models/product.model';
import { CouponModel } from 'src/DB/Models/coupons.model';
import { CouponRepository } from 'src/DB/repos/coupons.repo';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    CartRepository,
    ProductRepository,
    CouponRepository,
  ],
  imports: [TokenModule, OrderModel, cartModel, ProductModel, CouponModel],
})
export class OrderModule {}
