import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';
import { CreateBrandDto } from './brand/brand.dto';

@Controller('brand')
@UseGuards(AuthGuard)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseGuards(RoleGuard(UserRoleEnum.ADMIN))
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandService.createBrand(createBrandDto);
    return {
      message: 'Brand created successfully',
      data: brand,
    };
  }
}
