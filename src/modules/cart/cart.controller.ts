import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDTO } from './dto/addToCart.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: Request) {
    const userId = (req as any).user._id;
    return await this.cartService.getCart(userId);
  }

  @Post()
  async addToCart(@Req() req: Request, dto: AddToCartDTO) {
    const userId = (req as any).user._id;
    return await this.cartService.addToCart(userId, dto);
  }

  @Patch(':productId')
  async removeFromCart(
    @Req() req: Request,
    @Param('productId') productId: string,
  ) {
    const userId = (req as any).user._id;
    return await this.cartService.removeItem(userId, productId);
  }

  @Delete()
  async clearCart(@Req() req: Request) {
    const userId = (req as any).user._id;
    return await this.cartService.clearCart(userId);
  }
}
