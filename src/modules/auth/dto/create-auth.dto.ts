import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  ValidateIf,
} from 'class-validator';
import {
  ProviderEnum,
  UserGenderEnum,
  UserRoleEnum,
} from 'src/common/enums/user.enum';

export class RegisterAuthDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50, {
    message: 'First name must be between 3 and 50 characters long',
  })
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 50, {
    message: 'First name must be between 3 and 50 characters long',
  })
  lastName!: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value.toLowerCase())
  @Transform(({ value }) => value.trim())
  email!: string;

  @IsString()
  @ValidateIf((dto: RegisterAuthDto) => dto.provider !== ProviderEnum.GOOGLE)
  @IsNotEmpty({ message: 'Password is required' })
  @IsStrongPassword({}, { message: 'Password is not strong enough' })
  @Length(8, 100, {
    message: 'Password must be between 8 and 100 characters long',
  })
  password!: string;

  @IsEnum(ProviderEnum, { message: 'Provider must be a valid provider' })
  provider!: string;

  @IsEnum(UserGenderEnum, { message: 'Gender must be a valid gender' })
  @IsOptional()
  gender!: string;

  @IsString()
  @IsOptional()
  @IsEnum(UserRoleEnum, { message: 'Role must be a valid role' })
  role!: string;
}
