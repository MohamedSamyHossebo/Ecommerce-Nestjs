import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from 'src/DB/repos/brand.repo';
import { BrandModel } from 'src/DB/Models/brand.model';
import { CategoryModel } from 'src/DB/Models/category.model';
import { UserModel } from 'src/DB/Models/user.model';
import { TokenModule } from 'src/common/modules/token/token.module';

@Module({
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  imports: [BrandModel, CategoryModel, UserModel, TokenModule],
})
export class BrandModule {}
