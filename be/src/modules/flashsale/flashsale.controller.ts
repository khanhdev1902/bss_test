import { Body, Controller, Get, Post } from '@nestjs/common';
import { FlashSaleService } from './flashsale.service';

@Controller('flash-sale')
export class FlashSaleController {
  constructor(private readonly flashsaleService: FlashSaleService) {}

  @Get()
  getLstFalshSale() {
    return this.flashsaleService.getLstFalshSale();
  }

  @Post('buy')
  buyProduct(@Body() data: { phone: string; productId: number }) {
    return this.flashsaleService.buyProduct(data.phone, data.productId);
  }
}
