import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from 'src/auth';
import { getUserIdFromRequest } from 'src/shared';
import { OrderDto } from './models';
import { OrderService } from './services';

@Controller('api/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getOrders(): Promise<OrderDto[]> {
    const orders = await this.orderService.findAll();
    return orders;
  }

  @Get(':id')
  async getOrder(@Param('id') orderId): Promise<OrderDto> {
    const order = await this.orderService.findById(orderId);
    return order;
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async submitOrder(@Req() req, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const order = await this.orderService.create({
      ...body,
      userId,
    });

    return order;
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteOrder(@Param('id') orderId) {
    return this.orderService.delete(orderId);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id/status')
  async updateOrder(@Param('id') orderId, @Body() body) {
    return this.orderService.updateStatus(orderId, body);
  }
}
