import { Global, Module } from '@nestjs/common';
import { RedisService } from './cache.service';

@Global()
@Module({
  providers: [RedisService],
})
export class CacheModule {}
