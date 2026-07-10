import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDTO {
  @IsString()
  @IsNotEmpty({ message: 'Product ID is Required' })
  product!: string;

  @IsNumber()
  @Min(1, { message: 'Quantity Must Be At Least 1' })
  @IsNotEmpty({ message: 'Quantity is Required' })
  quantity!: number;
}
