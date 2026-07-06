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
import type { Request } from 'express';
import { BrandService } from './brand.service';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';
import { CreateBrandDto, UpdateBrandDto } from './brand/brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads/brands',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createBrand(
    @Req() req: Request,
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const brand = await this.brandService.createBrand({
      ...createBrandDto,
      logo: file?.path,
      createdBy: (req as any).user._id,
    });
    return {
      message: 'Brand created successfully',
      data: brand,
    };
  }

  @Get('all')
  async getAllBrands() {
    const brands = await this.brandService.getAllBrands();
    return {
      message: 'Brands fetched successfully',
      data: brands,
    };
  }

  @Get(':id')
  async getBrandById(@Param('id') id: string) {
    const brand = await this.brandService.getBrandById(id);
    return {
      message: 'Brand fetched successfully',
      data: brand,
    };
  }
  @Patch(':id')
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads/brands',
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateBrand(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    const brand = await this.brandService.updateBrand(id, updateBrandDto, file);
    return {
      message: 'Brand updated successfully',
      data: brand,
    };
  }
  @Delete(':id')
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  async deleteBrand(@Param('id') id: string) {
    const brand = await this.brandService.deleteBrand(id);
    return {
      message: 'Brand deleted successfully',
      data: brand,
    };
  }
}
