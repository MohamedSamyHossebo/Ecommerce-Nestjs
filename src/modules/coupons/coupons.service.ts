import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponRepository } from 'src/DB/repos/coupons.repo';

@Injectable()
export class CouponsService {
  constructor(private readonly couponRepository: CouponRepository) {}
  async create(dto: CreateCouponDto, adminId: string) {
    const trimedCode = dto.code.trim().toUpperCase();

    const existingCoupon = await this.couponRepository.findOne({
      code: trimedCode,
    });

    if (existingCoupon) throw new ConflictException('Coupon already exists');

    const newCoupone = await this.couponRepository.create({
      ...dto,
      code: trimedCode,
      createdBy: adminId,
    });

    return await newCoupone.save();
  }
  async findAll() {
    return this.couponRepository.find({}, '', {
      populate: {
        path: 'createdBy',
        select: 'firstName lastName email',
      },
    });
  }
  async findOne(id: string) {
    const coupon = await this.couponRepository.findById(id, '', {
      populate: {
        path: 'createdBy',
        select: 'firstName lastName email',
      },
    });

    if (!coupon) throw new NotFoundException('Coupon not found');

    return coupon;
  }
  async update(id: string, dto: UpdateCouponDto) {
    const updated = this.couponRepository.findByIdAndUpdate(id, dto);

    if (!updated) throw new NotFoundException('Coupon not found');

    return updated;
  }
  async delete(id: string) {
    const deleted = this.couponRepository.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Coupon not found');

    return deleted;
  }
  async validateCoupone(code: string, userId: string) {
    const coupon = await this.couponRepository.findOne({
      code: code.toUpperCase().trim(),
    });

    if (!coupon) throw new NotFoundException('Coupon not found');

    if (new Date() > coupon.expireDate) {
      throw new ConflictException('Coupon has expired');
    }
    if (coupon.usedCount >= coupon.maxUsage) {
      throw new ConflictException('Coupon has reached its maximum usage');
    }
    const hasUsed = coupon.usedBy.map((id) => id.toString()).includes(userId);

    if (hasUsed)
      throw new ConflictException('You have already used this coupon');

    return { valid: true, coupon };
  }
}
