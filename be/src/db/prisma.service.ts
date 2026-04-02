// import { Injectable } from '@nestjs/common';
// import { PrismaMariaDb } from '@prisma/adapter-mariadb';
// import { PrismaClient } from 'src/generated/prisma/client';
// import 'dotenv/config';

// @Injectable()
// export class PrismaService extends PrismaClient {
//   constructor() {
//     const adapter = new PrismaMariaDb({
//       host: process.env.DATABASE_HOST,
//       user: process.env.DATABASE_USER,
//       password: process.env.DATABASE_PASSWORD,
//       database: process.env.DATABASE_NAME,
//       connectionLimit: 5,
//     });
//     super({ adapter });
//   }
// }

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
const connectionString = `${process.env.DATABASE_URL}`;
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
