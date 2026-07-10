import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository } from 'src/DB/repos/cart.repo';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { cartModel } from 'src/DB/Models/cart.model';
import { ProductModel } from 'src/DB/Models/product.model';
import { TokenModule } from 'src/common/modules/token/token.module';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository],
  imports: [cartModel, ProductModel, TokenModule],
})
export class CartModule {}
