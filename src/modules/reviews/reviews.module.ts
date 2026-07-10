import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TokenModule } from 'src/common/modules/token/token.module';
import { ReviewsModel } from 'src/DB/Models/reviews.model';
import { ReviewRepository } from 'src/DB/repos/reviews.repo';
import { ProductModel } from 'src/DB/Models/product.model';
import { ProductRepository } from 'src/DB/repos/product.repo';

@Module({
  imports: [TokenModule, ReviewsModel, ProductModel],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository, ProductRepository],
})
export class ReviewsModule {}
