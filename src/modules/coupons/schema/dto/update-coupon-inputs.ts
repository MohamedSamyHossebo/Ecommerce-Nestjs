import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateCouponInput } from './create-coupon-inputs';

@InputType()
export class UpdateCouponInput extends PartialType(CreateCouponInput) {
  @Field(() => String, { nullable: true })
  _id!: string;
}
