import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponInput } from './create-coupon-inputs';
import { Field, Int } from '@nestjs/graphql';

export class UpdateCouponInput extends PartialType(CreateCouponInput) {
  @Field(() => String, { nullable: true })
  _id!: string;
}
