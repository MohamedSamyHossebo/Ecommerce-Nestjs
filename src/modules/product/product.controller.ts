import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationDto } from './../../common/dto/pagination.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  async getAllProducts(@Query() query: PaginationDto) {
    const products = await this.productService.getAllProducts(query);
    return {
      message: 'Products fetched successfully',
      ...products,
    };
  }
  @Post('create')
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createProduct(
    @Body() data: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const product = await this.productService.createProduct(
      data,
      file,
      (req as any).user._id,
    );
    return {
      message: 'Product created successfully',
      product,
    };
  }
}
