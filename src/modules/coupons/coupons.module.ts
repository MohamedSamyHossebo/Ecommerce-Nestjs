import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { CouponRepository } from 'src/DB/repos/coupons.repo';
import { CouponModel } from 'src/DB/Models/coupons.model';

@Module({
  controllers: [CouponsController],
  providers: [CouponsService, CouponRepository],
  imports: [CouponModel],
})
export class CouponsModule {}
