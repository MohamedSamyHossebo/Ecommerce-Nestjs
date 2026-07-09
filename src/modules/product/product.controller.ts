import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { PaginationDto } from './../../common/dto/pagination.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateProductDTO } from './dto/update.product.dto';

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
    FilesInterceptor('images', 10, {
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
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const product = await this.productService.createProduct(
      data,
      files,
      (req as any).user._id,
    );
    return {
      message: 'Product created successfully',
      product,
    };
  }
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);
    return {
      message: 'Product fetched successfully',
      product,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProduct(
    @Param('id') id: string,
    @Body() data: UpdateProductDTO,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      data,
      files,
      (req as any).user._id,
    );
    return {
      message: 'Product updated successfully',
      updatedProduct,
    };
  }
}
