import { Module } from '@nestjs/common';
import { DatabaseManagerService } from './database-manager.service';

@Module({
  providers: [DatabaseManagerService],
  exports: [DatabaseManagerService]
})
export class DatabaseManagerModule {}
