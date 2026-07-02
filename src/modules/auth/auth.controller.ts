import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { VerifyEmailDto } from './dto/verify-email-dto';
import { ResendOTPDto } from './dto/resend-otp.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

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

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const result = await this.authService.login(loginAuthDto);
    return {
      message: 'User logged in successfully',
      data: result,
    };
  }

  @Post('forget-password')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    const result = await this.authService.forgetPassword(forgetPasswordDto);
    return {
      message: result.message,
    };
  }

  @Patch('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(resetPasswordDto);
    return {
      message: result.message,
    };
  }
}
