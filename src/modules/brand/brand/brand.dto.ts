import {
  Length,
  IsString,
  IsOptional,
  IsMongoId,
  IsArray,
} from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @Length(3, 20, {
    message: 'Name must be between 3 and 20 characters long',
  })
  name!: string;

  @IsString()
  @IsOptional()
  @Length(10, 2000, {
    message: 'Description must be between 10 and 2000 characters long',
  })
  description?: string;

  @IsString()
  logo!: string;

  @IsArray()
  @IsMongoId({ each: true })
  categories!: string[];

  @IsMongoId()
  createdBy!: string;
}
