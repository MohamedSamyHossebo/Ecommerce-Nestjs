import { Controller, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';

@Controller('brand')
@UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
}
