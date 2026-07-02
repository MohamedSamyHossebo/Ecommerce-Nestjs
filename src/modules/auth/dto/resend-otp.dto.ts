import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOTPDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value.toLowerCase())
  @Transform(({ value }) => value.trim())
  email!: string;
}
