import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/db/prisma.service';

@Processor('test')
export class OrderProcessor extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ phone: string; productId: number }>) {
    const { phone, productId } = job.data;

    try {
      return await this.prisma.$transaction(async (tx) => {
        const existingOrder = await tx.order.findFirst({
          where: {
            productId,
            user: { Phone: phone },
          },
        });

        if (existingOrder) {
          throw new Error('Số điện thoại này đã tham gia Flash Sale');
        }

        const updatedProduct = await tx.product.update({
          where: {
            id: productId,
            stock: { gt: 0 },
          },
          data: {
            stock: { decrement: 1 },
          },
        });

        if (!updatedProduct) {
          throw new Error('Sản phẩm đã hết hàng');
        }

        const user = await tx.user.upsert({
          where: { Phone: phone },
          update: {},
          create: { Phone: phone },
        });

        const order = await tx.order.create({
          data: {
            userId: user.id,
            productId: productId,
          },
        });

        console.log(`Order created: ${order.id} for phone ${phone}`);
        return order;
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error(`Process failed: ${error.message}`);
      throw error;
    }
  }
}
