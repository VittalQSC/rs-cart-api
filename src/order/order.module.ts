import { Module } from '@nestjs/common';
import { CartModule } from 'src/cart/cart.module';
import { DatabaseManagerModule } from 'src/database-manager/database-manager.module';
import { OrderController } from './order.controller';
import { OrderService } from './services';

@Module({
  imports: [
    DatabaseManagerModule,
    CartModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
