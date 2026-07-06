import { BadRequestException, Injectable } from '@nestjs/common';
import { BrandRepository } from 'src/DB/repos/brand.repo';
import { CreateBrandDto, UpdateBrandDto } from './brand/brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepository) {}
  async createBrand(
    createBrandDto: CreateBrandDto & { logo?: string; createdBy?: string },
  ) {
    const { name, description, logo, createdBy } = createBrandDto;
    const brandExists = await this.brandRepo.findOne({ name });
    if (brandExists) {
      throw new BadRequestException(`Brand with name ${name} already exists`);
    }
    const brand = await this.brandRepo.create({
      name,
      description,
      logo,
      createdBy,
    });
    return brand;
  }

  async getAllBrands() {
    const brands = await this.brandRepo.find({}, '', {
      populate: [
        { path: 'createdBy', select: 'firstName lastName email' },
        { path: 'categories' },
      ],
      lean: true,
    });

    if (brands?.length === 0) {
      throw new BadRequestException('No brands found');
    }

    return brands;
  }
  async getBrandById(id: string) {
    const brand = await this.brandRepo.findById(id, '', {
      populate: [
        { path: 'createdBy', select: 'firstName lastName email' },
        { path: 'categories' },
      ],
      lean: true,
    });
    if (!brand) {
      throw new BadRequestException(`Brand with id ${id} not found`);
    }
    return brand;
  }
  async updateBrand(
    id: string,
    updateBrandDto: UpdateBrandDto,
    file: Express.Multer.File,
  ) {
    const { name, description } = updateBrandDto;
    const brandExists = await this.brandRepo.findOne({ name });
    if (brandExists) {
      throw new BadRequestException(`Brand with name ${name} already exists`);
    }
    const brand = await this.brandRepo.findByIdAndUpdate(
      id,
      {
        name,
        description,
        logo: file?.path,
      },
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
    if (!brand) {
      throw new BadRequestException(`Brand with id ${id} not found`);
    }
    return brand;
  }
  async deleteBrand(id: string) {
    const brand = await this.brandRepo.findOneAndDelete({ _id: id });
    if (!brand) {
      throw new BadRequestException(`Brand with id ${id} not found`);
    }
    return brand;
  }
}
