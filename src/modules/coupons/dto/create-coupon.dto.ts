import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty({ message: 'Code is required' })
  code!: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  discountPercentage!: number;

  @IsDateString({}, { message: 'Invalid date format. Use ISO format.' })
  expireDate!: Date;

  @IsInt()
  @Min(1)
  maxUsage!: number;
}
