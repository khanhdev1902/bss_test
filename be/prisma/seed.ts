import { PrismaService } from 'src/db/prisma.service';

const prisma = new PrismaService();

async function main() {
  console.log('Đang bắt đầu seed dữ liệu...');

  await prisma.flashSale.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  //Tạo Danh sách Sản phẩm
  const product1 = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max',
      stock: 20,
      price: 1000,
      imageUrl:
        'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:100/plain/https://cellphones.com.vn/media/wysiwyg/Phone/Apple/iphone_15/dien-thoai-iphone-15-256gb-8.jpg',
    },
  });

  //Tạo chương trình Flash Sale cho iPhone
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  await prisma.flashSale.create({
    data: {
      productId: product1.id,
      startDate: now,
      endDate: tomorrow,
      discount: 10, // Giảm 10%
    },
  });

  console.log({
    message: 'Seed dữ liệu thành công!',
    productsCount: 2,
    flashSaleActive: product1.name,
  });
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
