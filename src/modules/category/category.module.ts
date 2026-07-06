import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from 'src/DB/repos/category.repo';
import { CategoryModel } from 'src/DB/Models/category.model';
import { TokenModule } from 'src/common/modules/token/token.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  imports: [CategoryModel, TokenModule],
})
export class CategoryModule {}
