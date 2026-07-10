import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'userId is required' })
  userId!: string;

  @IsMongoId()
  @IsNotEmpty({ message: 'productId is required' })
  productId!: string;

  @IsNumber()
  @Max(5, { message: 'rating must be less than or equal to 5' })
  @Min(1, { message: 'rating must be greater than or equal to 1' })
  @IsNotEmpty({ message: 'rating is required' })
  rating!: number;

  @IsString()
  @Length(5, 300, { message: 'comment must be between 5 and 300 characters' })
  @IsNotEmpty({ message: 'comment is required' })
  comment!: string;
}
