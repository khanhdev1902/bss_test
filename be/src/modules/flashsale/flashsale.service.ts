import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { QueueService } from 'src/queue/queue.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class FlashSaleService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
    private queueService: QueueService,
  ) {}

  async onModuleInit() {
    await this.syncStockToRedis();
  }

  async syncStockToRedis() {
    const flashSales = await this.prisma.flashSale.findMany({
      include: { product: true },
    });

    const pipeline = this.redisService.getClient().pipeline();
    for (const fs of flashSales) {
      const key = `product_stock:${fs.productId}`;
      pipeline.set(key, fs.product.stock);
    }
    await pipeline.exec();
    console.log(`Synced ${flashSales.length} products to Redis`);
  }

  async getLstFalshSale() {
    const now = new Date();
    const lst = await this.prisma.flashSale.findMany({
      where: { endDate: { gte: now } },
      include: {
        product: true,
      },
    });
    return lst;
  }
  async buyProduct(phone: string, productId: number) {
    console.log(phone, productId);
    const stockKey = `product_stock:${productId}`;
    const userKey = `user:${phone}-${productId}`;

    const exists = await this.redisService.get(stockKey);
    const userExist = await this.redisService.get(userKey);
    if (userExist) {
      throw new BadRequestException('Bạn đã mua sản phẩm này rồi');
    }
    if (!exists || userExist) {
      throw new BadRequestException('Flash sale chưa init');
    }

    const currentStock = await this.redisService.getClient().decr(stockKey);
    console.log(currentStock);

    if (currentStock < 0) {
      await this.redisService.getClient().incr(stockKey);
      throw new BadRequestException('Hết hàng rồi đại vương ơi!');
    }

    await this.redisService.set(userKey, phone);
    await this.queueService.addJob('process-order', { phone, productId });
    return { message: 'Đang xử lý đơn hàng, check sau nha!' };
  }
}
