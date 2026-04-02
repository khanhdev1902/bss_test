import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue('test', {
      connection: {
        url: 'redis://default:6pHceGi7rVRx2YqAn1YtFqDE7H3sNiUU@redis-13288.crce264.ap-east-1-1.ec2.cloud.redislabs.com:13288',
      },
    });
  }

  async addJob(name: string, data: any) {
    await this.queue.add(name, data);
  }
}
