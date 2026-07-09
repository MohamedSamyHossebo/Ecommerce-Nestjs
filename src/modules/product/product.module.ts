import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductModel } from './../../DB/Models/product.model';
import { TokenModule } from 'src/common/modules/token/token.module';
import { ProductRepository } from 'src/DB/repos/product.repo';

@Module({
  imports: [ProductModel, TokenModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
