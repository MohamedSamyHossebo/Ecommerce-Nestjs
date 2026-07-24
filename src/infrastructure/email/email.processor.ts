import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EMAIL_JOBS, QUEUES } from '../queues/queue.constants';
import { MailService } from 'src/modules/mail/mail.service';
import { Job } from 'bullmq';

@Processor(QUEUES.EMAIL)
export class EmailProcessor extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }
  async process(job: Job) {
    switch (job.name) {
      case EMAIL_JOBS.REGISTER:
        await this.mailService.handleSendVerificationOtp(job.data);
        break;
      case EMAIL_JOBS.FORGET_PASSWORD:
        await this.mailService.handleSendForgetPasswordOtp(job.data);
        break;
      default:
        break;
    }
  }
}
