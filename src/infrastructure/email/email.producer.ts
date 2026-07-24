import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { EMAIL_JOBS, QUEUES } from '../queues/queue.constants';
import { Queue } from 'bullmq';
import { RegisterEmailDto } from './dto/register-email-dto';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue(QUEUES.EMAIL) private readonly queue: Queue) {}

  async sendRegistrationEmail(data: RegisterEmailDto) {
    await this.queue.add(EMAIL_JOBS.REGISTER, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });
  }
}
