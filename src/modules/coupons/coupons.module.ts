import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { CouponRepository } from 'src/DB/repos/coupons.repo';
import { CouponModel } from 'src/DB/Models/coupons.model';
import { TokenModule } from 'src/common/modules/token/token.module';

@Module({
  controllers: [CouponsController],
  providers: [CouponsService, CouponRepository],
  imports: [CouponModel,TokenModule],
})
export class CouponsModule {}
