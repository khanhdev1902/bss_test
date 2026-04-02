import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { OrderProcessor } from './processors/order.processor';
import { BullModule } from '@nestjs/bullmq';
import { PrismaService } from 'src/db/prisma.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'test',
    }),
    BullModule.forRoot({
      connection: {
        url: 'redis://default:6pHceGi7rVRx2YqAn1YtFqDE7H3sNiUU@redis-13288.crce264.ap-east-1-1.ec2.cloud.redislabs.com:13288',
      },
    }),
  ],
  providers: [QueueService, OrderProcessor, PrismaService],
  exports: [QueueService],
})
export class QueueModule {}
