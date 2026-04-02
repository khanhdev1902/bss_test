import { Module } from '@nestjs/common';
import { FlashSaleController } from './flashsale.controller';
import { FlashSaleService } from './flashsale.service';
import { PrismaService } from 'src/db/prisma.service';

@Module({
  imports: [],
  controllers: [FlashSaleController],
  providers: [FlashSaleService, PrismaService],
})
export class FlashSaleModule {}
