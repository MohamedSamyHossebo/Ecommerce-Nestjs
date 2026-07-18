import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDateString,
  IsInt,
} from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateCouponInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty({ message: 'Code is required' })
  code!: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercentage!: number;

  @Field(() => String)
  @IsDateString({}, { message: 'Invalid date format. Use ISO format.' })
  expireDate!: Date;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  maxUsage!: number;
}
