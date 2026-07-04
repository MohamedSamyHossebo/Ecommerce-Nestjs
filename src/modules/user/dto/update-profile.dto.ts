import { Transform } from 'class-transformer/types/decorators';
import {
  IsString,
  Length,
  IsEmail,
  IsStrongPassword,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserGenderEnum } from 'src/common/enums/user.enum';

export class UpdateProfileDTO {
  @IsOptional()
  @IsString()
  @Length(3, 50, {
    message: 'First name must be between 3 and 50 characters long',
  })
  firstName!: string;

  @IsOptional()
  @IsString()
  @Length(3, 50, {
    message: 'First name must be between 3 and 50 characters long',
  })
  lastName!: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Transform(({ value }) => value.trim())
  email!: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword({}, { message: 'Password is not strong enough' })
  @Length(8, 100, {
    message: 'Password must be between 8 and 100 characters long',
  })
  password!: string;

  @IsOptional()
  @IsString()
  @IsEnum(UserGenderEnum, { message: 'Gender must be a valid gender' })
  gender!: string;
}
