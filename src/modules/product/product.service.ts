import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { PaginationDto } from './../../common/dto/pagination.dto';
import { CreateProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async getAllProducts(query: PaginationDto) {
    return await this.productRepo.paginate(
      {},
      {
        ...query,
        populate: [
          { path: 'category' },
          { path: 'brand', populate: 'categories' },
          { path: 'createdBy', select: 'name' },
        ],
      },
    );
  }
  async createProduct(
    data: CreateProductDto,
    file: Express.Multer.File,
    createdBy: string,
  ) {
    const isProductExist = await this.productRepo.findOne({ name: data.name });
    if (isProductExist) {
      throw new BadRequestException(`Product ${data.name} already exist`);
    }
    const product = await this.productRepo.create({
      ...data,
      images: [file.path],
      createdBy,
    });
    return product;
  }
}
