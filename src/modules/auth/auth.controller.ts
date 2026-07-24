import { Controller, Post, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { VerifyEmailDto } from './dto/verify-email-dto';
import { ResendOTPDto } from './dto/resend-otp.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TwoFactorService } from 'src/common/services/2fa/two-factor.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import {
  EnableTwoFactorDto,
  VerifyTwoFactorLoginDto,
  DisableTwoFactorDto,
} from './dto/two-factor.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

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

  @Post('2fa/generate')
  @UseGuards(AuthGuard)
  async generate2FASecret(@Req() req: any) {
    const result = await this.twoFactorService.generateSecret(
      req.user._id,
      req.user.email,
    );
    return {
      message: '2FA secret and QR code generated successfully',
      data: result,
    };
  }

  @Post('2fa/enable')
  @UseGuards(AuthGuard)
  async enable2FA(@Req() req: any, @Body() dto: EnableTwoFactorDto) {
    const result = await this.twoFactorService.enableTwoFactor(
      req.user._id,
      dto.code,
    );
    return {
      message: '2FA enabled successfully. Store your backup codes safely!',
      data: result,
    };
  }

  @Post('2fa/verify-login')
  @UseGuards(AuthGuard)
  async verify2FALogin(@Req() req: any, @Body() dto: VerifyTwoFactorLoginDto) {
    const result = await this.authService.verifyTwoFactorLogin(req.user._id, dto.code);
    return {
      message: '2FA verification successful',
      data: result,
    };
  }

  @Post('2fa/disable')
  @UseGuards(AuthGuard)
  async disable2FA(@Req() req: any, @Body() dto: DisableTwoFactorDto) {
    const result = await this.twoFactorService.disableTwoFactor(
      req.user._id,
      dto.code,
    );
    return result;
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
