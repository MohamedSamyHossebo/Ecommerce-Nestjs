import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from './../../DB/Models/product.model';
import { TokenModule } from 'src/common/modules/token/token.module';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { CacheModule } from 'src/cache/cache.module';
import { RedisService } from 'src/cache/cache.service';

@Module({
  imports: [ProductModel, TokenModule, CacheModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, RedisService],
})
export class ProductModule {}
