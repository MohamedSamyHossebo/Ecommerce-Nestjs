import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({
    message: 'shippingAddress is required',
  })
  shippingAddress!: string;
  @IsString()
  @IsOptional()
  couponCode?: string;
}
