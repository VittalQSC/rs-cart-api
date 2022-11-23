import { Module } from '@nestjs/common';
import { DatabaseManagerModule } from 'src/database-manager/database-manager.module';

import { CartController } from './cart.controller';
import { CartService } from './services';

@Module({
  imports: [DatabaseManagerModule],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
