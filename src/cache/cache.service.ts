import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;
  onModuleInit() {
    this.client = new Redis(process.env.REDIS_HOST as string);
    this.client.on('connect', () => {
      console.log('Redis client connected');
    });
    this.client.on('error', (err) => {
      console.error('Redis client error', err);
    });
  }

  async set(key: string, value: string, ttl?: number) {
    await this.client.set(key, value, 'EX', ttl || 60 * 60 * 24);
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
  async delByPattern(pattern: string) {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  onModuleDestroy() {
    this.client.quit();
  }
}
