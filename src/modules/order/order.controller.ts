import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Patch,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Post('checkout')
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateOrderDto, @Req() req: any) {
    const userId = req.user._id;
    const order = await this.orderService.checkout(dto, userId);
    return { message: 'Order created successfully', order };
  }

  @Post('webhook')
  async stripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.orderService.handleWebhook(req.rawBody as Buffer, signature);
    return { received: true };
  }
  @Get()
  @UseGuards(AuthGuard)
  async getMyOrders(@Req() req: any) {
    const userId = req.user._id;
    const orders = await this.orderService.getMyOrders(userId);
    return { message: 'Orders fetched successfully', orders };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrderById(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    const order = await this.orderService.getOrderById(id, userId);
    return { message: 'Order fetched successfully', order };
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard)
  async cancelOrder(@Param('id') id: string, @Req() req: any) {
    const userId = req.user._id;
    const order = await this.orderService.cancelOrder(id, userId);
    return { message: 'Order cancelled successfully', order };
  }
}
