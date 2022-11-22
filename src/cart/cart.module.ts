import { Module } from '@nestjs/common';
import { DatabaseManagerModule } from 'src/database-manager/database-manager.module';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';


@Module({
  imports: [ DatabaseManagerModule, OrderModule ],
  providers: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
