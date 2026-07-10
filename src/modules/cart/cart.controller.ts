import {
  Body,
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
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';

@UseGuards(AuthGuard, RoleGuard(UserRoleEnum.USER, UserRoleEnum.ADMIN))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: Request) {
    const userId = (req as any).user._id;
    return await this.cartService.getCart(userId);
  }

  @Post()
  async addToCart(@Req() req: Request, @Body() dto: AddToCartDTO) {
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

  @Patch('increase/:productId')
  async increaseCartItemQuantity(
    @Req() req: Request,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    const userId = (req as any).user._id;
    return await this.cartService.increaseCartItemQuantity(
      userId,
      productId,
      quantity,
    );
  }

  @Patch('decrease/:productId')
  async decreaseCartItemQuantity(
    @Req() req: Request,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    const userId = (req as any).user._id;
    return await this.cartService.decreaseCartItemQuantity(
      userId,
      productId,
      quantity,
    );
  }
}
