import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

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
}
