import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/DB/repos/category.repo';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async createCategory(
    categoryDto: CreateCategoryDTO,
    file: Express.Multer.File,
    createdBy: string,
  ) {
    const category = await this.categoryRepo.create({
      ...categoryDto,
      logo: file.path,
      createdBy,
    });
    if (!category) {
      return 'Failed to create category';
    }
    return category;
  }

  async updateCategory(
    categoryDto: UpdateCategoryDTO,
    file: Express.Multer.File,
    id: string,
    updatedBy: string,
  ) {
    const { name, description } = categoryDto;
    if (!name && !description && !file) {
      throw new BadRequestException('No data provided to update');
    }

    const updateData: any = { ...categoryDto, updatedBy };
    if (file) {
      updateData.logo = file.path;
    }

    const category = await this.categoryRepo.findByIdAndUpdate(id, updateData);

    if (!category) {
      throw new BadRequestException(
        `Failed to update category or category with id ${id} not found`,
      );
    }
    return category;
  }
  async getAllCategories() {
    const categories = await this.categoryRepo.find({}, '', {
      populate: 'brand',
    });
    if (!categories) {
      return 'Failed to fetch categories';
    }
    return categories;
  }
  async getCategoryById(id: string) {
    const category = await this.categoryRepo.findById(id, '', {
      populate: 'brand',
    });
    if (!category) {
      return 'Failed to fetch category';
    }
    return category;
  }
  async deleteCategory(id: string) {
    const category = await this.categoryRepo.deleteOne({ _id: id });
    if (!category) {
      throw new BadRequestException(
        'Failed to delete category or category with id ' + id + ' not found',
      );
    }
    return category;
  }
}
