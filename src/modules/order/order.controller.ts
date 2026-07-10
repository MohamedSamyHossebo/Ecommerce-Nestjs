import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('checkout')
  @UseGuards(AuthGuard)
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req.user._id;
    return this.orderService.checkout(dto, userId);
  }
}
