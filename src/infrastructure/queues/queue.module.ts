import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUES } from './queue.constants';
import Redis from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUri = configService.get<string>('REDIS_HOST') as string;
        const parsedUrl = new URL(redisUri);
        return {
          connection: {
            host: parsedUrl.hostname,
            port: Number(parsedUrl.port),
            password: parsedUrl.password,
            username: parsedUrl.username,
            tls: parsedUrl.protocol === 'rediss:' ? {} : undefined,
          },
        };
      },
    }),
    BullModule.registerQueue({ name: QUEUES.EMAIL }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
