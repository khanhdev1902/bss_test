import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  // eslint-disable-next-line @typescript-eslint/require-await
  async onModuleInit() {
    this.client = new Redis(
      'redis://default:6pHceGi7rVRx2YqAn1YtFqDE7H3sNiUU@redis-13288.crce264.ap-east-1-1.ec2.cloud.redislabs.com:13288',
      {
        maxRetriesPerRequest: null,
      },
    );
  }

  getClient(): Redis {
    return this.client;
  }

  async set(key: string, value: number | string) {
    await this.client.set(key, value);
  }

  async get(key: string) {
    return this.client.get(key);
  }
}
