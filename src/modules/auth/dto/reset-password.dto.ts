import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Transform(({ value }) => value.trim())
  @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
  otp!: string;

  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @IsStrongPassword({}, { message: 'New password is not strong enough' })
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  newPassword!: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword!: string;
}
