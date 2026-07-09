import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, {
    message: 'Name must be between 3 and 20 characters long',
  })
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsString()
  @IsNotEmpty()
  brand!: mongoose.Types.ObjectId;
}

export class UpdateCategoryDTO {
  @IsString()
  @Length(3, 20, {
    message: 'Name must be between 3 and 20 characters long',
  })
  @IsOptional()
  name!: string;

  @IsString()
  @IsOptional()
  description!: string;

  @IsString()
  brand!: mongoose.Types.ObjectId;
}
