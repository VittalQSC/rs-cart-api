import { Injectable } from '@nestjs/common';
import { CartService } from 'src/cart';
import { DatabaseManagerService } from 'src/database-manager/database-manager.service';
import { v4 } from 'uuid';

import { OrderDto, StatusHistoryDto } from '../models';

@Injectable()
export class OrderService {
  constructor(
    private databaseManagerService: DatabaseManagerService,
    private cartService: CartService,
  ) {}

  async findAll(): Promise<OrderDto[]> {
    const createEmptyOrder = (): OrderDto => ({
      id: null,
      items: [] as { productId: string; count: number }[],
      address: undefined,
      statusHistory: [] as StatusHistoryDto[],
    });

    const result = await this.databaseManagerService.query(`
      select *, osh.id as osh_id from order_items oi
      left join orders o on oi.order_id = o.id
      left join order_status_histories osh on o.id = osh.order_id;
    `);

    const mapOrderIdToOrder: Record<string, OrderDto> = {};
    if (result && result.rows && result.rows.length > 0) {
      result.rows.forEach(row => {
        if (!mapOrderIdToOrder[row.order_id]) {
          mapOrderIdToOrder[row.order_id] = createEmptyOrder();
          mapOrderIdToOrder[row.order_id].id = row.order_id;
        }

        const order = mapOrderIdToOrder[row.order_id];

        order.address = {
          firstName: row.first_name as string,
          lastName: row.last_name as string,
          address: row.address as string,
          comment: '',
        };

        if (!order.items.find(item => item.productId === row.product_id)) {
          order.items.push({ productId: row.product_id, count: row.count });
        }

        if (!order.statusHistory.find(sh => sh.osh_id === row.osh_id)) {
          order.statusHistory.push({
            status: row.status,
            timestamp: row.timestamp,
            comment: row.comment,
            osh_id: row.osh_id,
          });
        }
      });
    }

    return Object.values(mapOrderIdToOrder);
  }

  async findById(orderId: string): Promise<OrderDto> {
    const order = {
      id: orderId,
      items: [] as { productId: string; count: number }[],
      address: undefined,
      statusHistory: [] as StatusHistoryDto[],
    };

    const result = await this.databaseManagerService.query(`
      select *, osh.id as osh_id from order_items oi
      inner join orders o on o.id = oi.order_id
      left join order_status_histories osh on o.id = osh.order_id
      where o.id = '${orderId}';
    `);

    if (result && result.rows && result.rows.length > 0) {
      result.rows.forEach(row => {
        order.address = order.address ?? {
          firstName: row.first_name,
          lastName: row.last_name,
          address: row.address,
        };
        if (!order.items.find(item => item.productId === row.product_id)) {
          order.items.push({ productId: row.product_id, count: row.count });
        }

        if (!order.statusHistory.find(sh => sh.osh_id === row.osh_id)) {
          order.statusHistory.push({
            status: row.status,
            timestamp: row.timestamp,
            comment: row.comment,
            osh_id: row.osh_id,
          });
        }
      });
    }

    return order;
  }

  async create(data: OrderDto & { userId: string }) {
    const id = v4(v4());
    try {
      await this.databaseManagerService.query(`
        insert into orders(id, address, first_name, last_name)
        values('${id}', '${data.address.address}', '${
        data.address.firstName
      }', '${data.address.lastName}');

      insert into order_status_histories(order_id, status, comment) 
      values('${id}', 'OPEN', '${data.address.comment}');

        ${data.items
          .map(
            item => `
      insert into order_items(order_id, product_id, count)
      values('${id}', '${item.productId}', ${item.count});
          `,
          )
          .join('\n')}
      `);

      await this.cartService.removeByUserId(data.userId);
    } catch (error) {
      console.log('error', error);
    }

    return this.findById(id);
  }

  async delete(orderId) {
    await this.databaseManagerService.query(`
      delete from orders where id = '${orderId}';
    `);
    return 'OK';
  }

  async updateStatus(orderId, data) {
    await this.databaseManagerService.query(`
      insert into order_status_histories(order_id, status, comment) 
      values('${orderId}', '${data.status}', '${data.comment}');
    `);
    return 'OK';
  }
}
