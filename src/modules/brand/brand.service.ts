import { Injectable } from '@nestjs/common';
import { BrandRepository } from 'src/DB/repos/brand.repo';
import { CreateBrandDto } from './brand/brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepository) {}
  async createBrand(createBrandDto: CreateBrandDto) {


    
  }
}
