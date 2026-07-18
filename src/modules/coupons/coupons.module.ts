import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { CouponRepository } from 'src/DB/repos/coupons.repo';
import { CouponModel } from 'src/DB/Models/coupons.model';
import { TokenModule } from 'src/common/modules/token/token.module';
import { CouponResolver } from './schema/coupon.resolver';

@Module({
  controllers: [CouponsController],
  providers: [CouponsService, CouponRepository, CouponResolver],
  imports: [CouponModel, TokenModule],
})
export class CouponsModule {}
