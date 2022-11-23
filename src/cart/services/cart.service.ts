import { Injectable } from '@nestjs/common';
import { DatabaseManagerService } from 'src/database-manager/database-manager.service';

import { v4 } from 'uuid';

import { Cart } from '../models';

@Injectable()
export class CartService {
  constructor(private databaseManagerService: DatabaseManagerService) {}

  async findByUserId(userId: string): Promise<Cart> {
    const result = await this.databaseManagerService.query(`
      select * from carts c 
      left join cart_items ci on c.id = ci.cart_id 
      where c.user_id = '${userId}';
    `);

    // TODO handle invalid responses
    if (!result || !result.rows) {
      return null;
    }

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    const items = [];
    result.rows.forEach(row => {
      if (row.product_id && !items.find(i => i.product_id === row.product_id)) {
        items.push({
          product_id: row.product_id,
          count: row.count,
        });
      }
    });

    const cart = {
      id: row.id,
      items,
    };

    return cart;
  }

  async createByUserId(userId: string) {
    const id = v4(v4());

    // TODO better to make single request for insert + select
    const result = await this.databaseManagerService.query(`
    insert into carts(id, user_id) values('${id}', '${userId}');
    select id from carts c 
    where c.user_id = '${userId}';
    `);

    if (!result || !result[1] || !result[1].rows) {
      return { id: null, items: [] };
    }

    return {
      id: result[1].rows[0].id,
      items: [],
    };
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

    return this.findByUserId(userId);
  }

  async removeByUserId(userId) {
    await this.databaseManagerService.query(`
      delete from carts where user_id = '${userId}';
    `);
  }
}
