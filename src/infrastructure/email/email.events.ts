import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';

@QueueEventsListener('email')
export class EmailEvents extends QueueEventsHost {
  @OnQueueEvent('completed')
  onCompleted(job: any) {
    console.log('Job completed', job.jobId);
  }

  @OnQueueEvent('failed')
  onFailed(job: any) {
    console.log('Job failed', job.failedReason);
  }
}
