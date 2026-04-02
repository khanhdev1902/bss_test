import { Module } from '@nestjs/common';
import { FlashSaleModule } from './modules/flashsale/flashsale.module';
import { RedisModule } from './redis/redis.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [FlashSaleModule, RedisModule, QueueModule],
})
export class AppModule {}
