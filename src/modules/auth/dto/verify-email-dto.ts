import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyEmailDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value.toLowerCase())
  @Transform(({ value }) => value.trim())
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Transform(({ value }) => value.trim())
  @Length(6, 6, { message: 'OTP must be 6 characters long' })
  otp!: string;
}
