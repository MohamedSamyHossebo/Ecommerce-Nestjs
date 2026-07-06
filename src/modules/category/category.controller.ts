import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/category.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() categoryDto: CreateCategoryDTO,
    @Req() req: Request,
  ) {
    return this.categoryService.createCategory(
      categoryDto,
      file,
      (req as any).user._id,
    );
  }

  @Get('all')
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }
  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads/categories',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateCategory(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Body() categoryDto: UpdateCategoryDTO,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    return this.categoryService.updateCategory(
      categoryDto,
      file,
      id,
      (req as any).user._id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  async deleteCategory(@Param('id') id: string) {
    const category = await this.categoryService.deleteCategory(id);
    return { message: 'Category deleted successfully', category };
  }
}
