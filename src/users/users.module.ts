import { Module } from '@nestjs/common';
import { DatabaseManagerModule } from 'src/database-manager/database-manager.module';

import { UsersService } from './services';

@Module({
  imports: [ DatabaseManagerModule ],
  providers: [ UsersService ],
  exports: [ UsersService ],
})
export class UsersModule {}
