import { Module } from '@nestjs/common';
import { EmailProducer } from './email.producer';
import { EmailProcessor } from './email.processor';
import { EmailEvents } from './email.events';
import { QueueModule } from '../queues/queue.module';
import { MailModule } from 'src/modules/mail/mail.module';

@Module({
  imports: [QueueModule, MailModule],
  providers: [EmailProducer, EmailProcessor, EmailEvents],
  exports: [EmailProducer],
})
export class EmailModule {}
