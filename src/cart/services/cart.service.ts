import { Injectable } from '@nestjs/common';
import { DatabaseManagerService } from 'src/database-manager/database-manager.service';

import { v4 } from 'uuid';

import { Cart } from '../models';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  constructor(private databaseManagerService: DatabaseManagerService) {}

  async findByUserId(userId: string): Promise<Cart> {
    const result = await this.databaseManagerService.query(`
      select * from carts c
      left join cart_items on c.id = cart_id 
      inner join users u on c.user_id = u.id where u.id = '${userId}';
    `);

    console.log(result);

    // TODO handle invalid responses
    if (!result || !result.rows) {
      return null;
    }

    const row = result.rows[0];
    if (!row || !row.cart_id) {
      return null;
    }

    const cart = {
      id: row.cart_id,
      items: result.rows
        .filter(r => !!r.product_id)
        .map(r => ({
          product_id: r.product_id,
          count: r.count,
        })),
    };

    return cart;
  }

  async createByUserId(userId: string) {
    const id = v4(v4());

    // TODO better to make single request for insert + select
    await this.databaseManagerService.query(`
    insert into carts(id, user_id) values('${id}', '${userId}');
    `);

    return this.findByUserId(userId);
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    await this.databaseManagerService.query(
      items
        .map(
          item => `
      insert into cart_items(count, product_id, cart_id)
      select ${item.count}, '${item.product_id}', id from carts c
      where c.user_id = '${userId}'
      on conflict (product_id, cart_id)
      do update set count = ${item.count};
    `,
        )
        .join('\n') +
        `
        delete from cart_items where count <= 0; 
    `,
    );

    return this.findOrCreateByUserId(userId);
  }

  async removeByUserId(userId) {
    await this.databaseManagerService.query(`
      delete from carts where user_id = '${userId}';
    `);
  }
}
