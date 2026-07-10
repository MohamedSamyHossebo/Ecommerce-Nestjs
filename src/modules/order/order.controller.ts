import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch } from '@nestjs/common';
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
  @Get()
  @UseGuards(AuthGuard)
  getMyOrders(@Req() req: any) {
    const userId = req.user._id;
    return this.orderService.getMyOrders(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getOrderById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    return this.orderService.getOrderById(id, userId);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard)
  cancelOrder(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    return this.orderService.cancelOrder(id, userId);
  }
}
