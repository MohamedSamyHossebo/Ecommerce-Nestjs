import { Global, Module } from '@nestjs/common';
import { RedisService } from './cache.service';
import { CacheInterceptor } from './interceptors/cache.interceptor';

@Global()
@Module({
  providers: [RedisService, CacheInterceptor],
  exports: [RedisService, CacheInterceptor],
})
export class CacheModule {}
