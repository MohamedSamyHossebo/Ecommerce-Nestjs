import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/DB/repos/product.repo';
import { PaginationDto } from './../../common/dto/pagination.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDTO } from './dto/update.product.dto';

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
  async getProductById(id: string) {
    const isExist = await this.productRepo.findById(id);
    if (!isExist) {
      throw new BadRequestException('Product not found');
    }
    return await this.productRepo.findById(id, '', {
      populate: [
        { path: 'category' },
        { path: 'brand', populate: 'categories' },
        { path: 'createdBy', select: 'name' },
      ],
    });
  }
  async createProduct(
    data: CreateProductDto,
    files: Express.Multer.File[],
    createdBy: string,
  ) {
    const isProductExist = await this.productRepo.findOne({ name: data.name });
    if (isProductExist) {
      throw new BadRequestException(`Product ${data.name} already exist`);
    }
    const product = await this.productRepo.create({
      ...data,
      images: files?.map((f) => f.path) || [],
      createdBy,
    });
    return product;
  }
  async updateProduct(
    id: string,
    data: UpdateProductDTO,
    files: Express.Multer.File[],
    updatedBy: string,
  ) {
    const isExits = await this.productRepo.findById(id);
    if (!isExits) {
      throw new BadRequestException('Product not found');
    }
    const updatedPrdouct = await this.productRepo.findOneAndUpdate(
      { _id: id },
      {
        ...data,
        images: files?.length ? files.map((f) => f.path) : isExits.images,
        updatedBy,
      },
      { new: true, populate: [{ path: 'category' }, { path: 'brand' }] },
    );
    return updatedPrdouct?.save();
  }
}
