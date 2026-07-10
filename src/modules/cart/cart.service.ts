import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartRepository } from 'src/DB/repos/cart.repo';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { AddToCartDTO } from './dto/addToCart.dto';
import { HCartDocument } from 'src/DB/Models/cart.model';

@Injectable()
export class CartService {
  constructor(
    private cartRepo: CartRepository,
    private productRepo: ProductRepository,
  ) {}

  private async recalculateCartTotal(cart: HCartDocument) {
    let total = 0;

    for (const item of cart.items) {
      item.subTotal = item.quantity * item.pricePerUnit;
      total += item.subTotal;
    }

    cart.totalPrice = total;
  }
  async getCart(userId: string) {
    let cart = await this.cartRepo.findOne({ user: userId }, '', {
      populate: {
        path: 'items.product',
      },
    });

    if (!cart) {
      cart = await this.cartRepo.create({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    return cart;
  }
  async addToCart(userId: string, dto: AddToCartDTO) {
    const { product, quantity } = dto;

    const foundProduct = await this.productRepo.findById(product);

    if (!foundProduct) {
      throw new NotFoundException('Product Not Found');
    }
    if (foundProduct.stock < quantity) {
      throw new BadRequestException(
        `Not Enough Stock , the amount of stock is ${foundProduct.stock.toString()}`,
      );
    }
    let cart = await this.cartRepo.findOne({ user: userId });
    if (!cart) {
      cart = await this.cartRepo.create({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === product,
    );

    const effectivePrice =
      foundProduct.discountPrice > 0
        ? foundProduct.price - foundProduct.discountPrice
        : foundProduct.price;

    if (existingItemIndex > -1) {
      const targetNewQuantity =
        cart.items[existingItemIndex].quantity + quantity;
      if (targetNewQuantity > foundProduct.stock) {
        throw new BadRequestException(
          `Not Enough Stock , the amount of stock is ${foundProduct.stock.toString()}`,
        );
      }
      cart.items[existingItemIndex].quantity = targetNewQuantity;
      cart.items[existingItemIndex].pricePerUnit = effectivePrice;
    } else {
      cart.items.push({
        product,
        quantity,
        pricePerUnit: effectivePrice,
        subTotal: effectivePrice * quantity,
      });
    }
    this.recalculateCartTotal(cart);
    await cart.save();
    return cart.populate('items.product');
  }
  async removeItem(userId: string, productId: string) {
    const cart = await this.cartRepo.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart Not Found');
    }
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    this.recalculateCartTotal(cart);
    await cart.save();
    return cart.populate('items.product');
  }
  async clearCart(userId: string) {
    const cart = await this.cartRepo.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart Not Found');
    }
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart Is Empty');
    }
    cart.items = [];
    this.recalculateCartTotal(cart);
    await cart.save();
    return cart.populate('items.product');
  }
  async increaseCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ) {
    const cart = await this.cartRepo.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart Not Found');
    }
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (existingItemIndex === -1) {
      throw new NotFoundException('Item Not Found');
    }
    const foundProduct = await this.productRepo.findById(productId);
    if (!foundProduct) {
      throw new NotFoundException('Product Not Found');
    }
    const targetNewQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (targetNewQuantity > foundProduct.stock) {
      throw new BadRequestException(
        `Not Enough Stock , the amount of stock is ${foundProduct.stock.toString()}`,
      );
    }
    cart.items[existingItemIndex].quantity = targetNewQuantity;
    this.recalculateCartTotal(cart);
    await cart.save();
    return cart.populate('items.product');
  }
  async decreaseCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ) {
    const cart = await this.cartRepo.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart Not Found');
    }
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (existingItemIndex === -1) {
      throw new NotFoundException('Item Not Found');
    }
    const targetNewQuantity = cart.items[existingItemIndex].quantity - quantity;
    if (targetNewQuantity < 0) {
      throw new BadRequestException(
        `Not Enough Stock , the amount of stock is ${cart.items[existingItemIndex].quantity.toString()}`,
      );
    }
    if (cart.items.length === 1 && targetNewQuantity === 0) {
      await this.clearCart(userId);
      return;
    }
    cart.items[existingItemIndex].quantity = targetNewQuantity;
    this.recalculateCartTotal(cart);
    await cart.save();
    return cart.populate('items.product');
  }
}
