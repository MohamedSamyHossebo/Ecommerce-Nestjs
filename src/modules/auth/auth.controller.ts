import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { VerifyEmailDto } from './dto/verify-email-dto';
import { ResendOTPDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signup(@Body() registerAuthDto: RegisterAuthDto) {
    const user = await this.authService.register(registerAuthDto);
    return {
      message: 'User registered successfully',
      data: user,
    };
  }
  @Patch('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const result = await this.authService.verifyEmail(verifyEmailDto);
    return {
      message: 'Email verified successfully',
      data: result,
    };
  }

  @Post('resend-otp')
  async resendOTP(@Body() resendOtpDto: ResendOTPDto) {
    const result = await this.authService.resendOTP(resendOtpDto);
    return {
      message: 'OTP resent successfully',
      data: result,
    };
  }
}
