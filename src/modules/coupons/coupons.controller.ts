import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { UserRoleEnum } from 'src/common/enums/user.enum';

@UseGuards(AuthGuard)
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  
  @UseGuards(RoleGuard(UserRoleEnum.ADMIN))
  @Post()
  create(@Body() createCouponDto: CreateCouponDto, @Req() req: any) {
    return this.couponsService.create(createCouponDto, req.user._id as string);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }
  @UseGuards(RoleGuard(UserRoleEnum.ADMIN))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponsService.update(id, updateCouponDto);
  }

  @UseGuards(RoleGuard(UserRoleEnum.ADMIN))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.couponsService.delete(id);
  }

  @Post('validate')
  validateCoupon(@Body('code') code: string, @Req() req: any) {
    return this.couponsService.validateCoupone(code, req.user._id as string);
  }
}
