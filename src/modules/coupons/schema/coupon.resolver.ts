import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Coupon } from './coupon.schema';
import { CreateCouponInput } from './dto/create-coupon-inputs';
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from 'src/common/guards/role/role.guard';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { CouponsService } from '../coupons.service';
import { UserRoleEnum } from 'src/common/enums/user.enum';
import { UpdateCouponInput } from './dto/update-coupon-inputs';

@Resolver(() => Coupon)
export class CouponResolver {
  constructor(private readonly couponService: CouponsService) {}

  @Query(() => [Coupon], { name: 'getCoupons' })
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  async getCoupons() {
    return this.couponService.findAll();
  }

  @Mutation(() => Coupon, { name: 'createCoupon' })
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  async createCoupon(
    @Args('createCouponInput') createCouponInput: CreateCouponInput,
    @Context() context: any,
  ) {
    const { id } = context.req.user;
    return this.couponService.create(createCouponInput, id);
  }
  @Mutation(() => Coupon, { name: 'updateCoupon' })
  @UseGuards(AuthGuard, RoleGuard(UserRoleEnum.ADMIN))
  async updateCoupon(
    @Args('updateCouponInput') updateCouponInput: UpdateCouponInput,
    @Context() context: any,
  ) {
    const { id } = context.req.user;
    return this.couponService.update(id, updateCouponInput);
  }
}
