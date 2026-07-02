import { ResendOTPDto } from './dto/resend-otp.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from 'src/DB/Models/user.model';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { compare, hash } from 'src/common/security/hash.security';
import { VerifyEmailDto } from './dto/verify-email-dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { verifyHash } from 'src/common/security/encryption.security';
import { TokenService } from 'src/common/modules/token/token.security';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailEvents } from '../mail/mail.events';
import {
  SendForgetPasswordOtpEvent,
  SendVerificationOtpEvent,
} from '../mail/mail.event-payloads';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
    private readonly eventEmitter: EventEmitter2,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUser = await this.userModel.findOne({
      email: registerAuthDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await hash(otp);
    const expireTime = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    console.log('Generated OTP:', otp);
    const newUser = new this.userModel({
      ...registerAuthDto,
      confirmEmailOTP: hashedOTP,
      otpExpiresAt: expireTime,
    });

    const savedUser = await newUser.save();

    this.eventEmitter.emit(
      MailEvents.SEND_VERIFICATION_OTP,
      new SendVerificationOtpEvent(savedUser.email, otp),
    );
    return savedUser;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.userModel.findOne({ email: verifyEmailDto.email });
    if (!user) {
      throw new ConflictException('User not found');
    }

    if (user.confirmEmail) {
      throw new ConflictException('Email is already verified');
    }

    if (!user.confirmEmailOTP) {
      throw new ConflictException('OTP not found or already used');
    }

    const isOtpValid = await compare(verifyEmailDto.otp, user.confirmEmailOTP);

    if (!isOtpValid) {
      throw new ConflictException('Invalid OTP');
    }

    if (user.otpExpiresAt && user.otpExpiresAt < new Date()) {
      throw new ConflictException('OTP has expired');
    }

    user.confirmEmail = new Date();
    user.confirmEmailOTP = undefined;
    user.otpExpiresAt = undefined;

    const savedUser = await user.save();

    return savedUser;
  }

  async resendOTP(resendOtpDto: ResendOTPDto) {
    const user = await this.userModel.findOne({ email: resendOtpDto.email });
    if (!user) {
      throw new ConflictException('User not found');
    }
    if (user.confirmEmail) {
      throw new ConflictException('Email is already verified');
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await hash(otp);
    const expireTime = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    console.log('Generated OTP:', otp);
    user.confirmEmailOTP = hashedOTP;
    user.otpExpiresAt = expireTime;

    const savedUser = await user.save();

    this.eventEmitter.emit(
      MailEvents.SEND_VERIFICATION_OTP,
      new SendVerificationOtpEvent(savedUser.email, otp),
    );
  }

  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.userModel.findOne({ email: loginAuthDto.email });
    if (!user) {
      throw new ConflictException('User not found');
    }
    if (!user.confirmEmail) {
      throw new ConflictException('Email is not verified');
    }
    const isPasswordValid = await verifyHash({
      plainText: loginAuthDto.password,
      cipherText: user.password,
    });
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    const accessToken = await this.tokenService.generateToken({
      payload: {
        _id: user._id,
        role: user.role,
      },
      secret: process.env.JWT_ACCESS_SIGNUTURE as string,
      options: {
        expiresIn: '30m',
      },
    });
    const refreshToken = await this.tokenService.generateToken({
      payload: {
        _id: user._id,
        role: user.role,
      },
      secret: process.env.JWT_REFRESH_SIGNUTURE as string,
      options: {
        expiresIn: '7d',
      },
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const user = await this.userModel.findOne({
      email: forgetPasswordDto.email,
    });
    if (!user) {
      throw new NotFoundException('No account found with this email');
    }
    if (!user.confirmEmail) {
      throw new BadRequestException(
        'Please verify your email before resetting your password',
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await hash(otp);
    const expireTime = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    user.forgetPasswordOTP = hashedOTP;
    user.forgetPasswordOTPExpiresAt = expireTime;
    await user.save();

    this.eventEmitter.emit(
      MailEvents.SEND_FORGET_PASSWORD_OTP,
      new SendForgetPasswordOtpEvent(user.email, otp),
    );

    return { message: 'Password reset OTP sent to your email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: resetPasswordDto.email,
    });
    if (!user) {
      throw new NotFoundException('No account found with this email');
    }
    if (!user.forgetPasswordOTP) {
      throw new BadRequestException(
        'No password reset was requested. Please request a new OTP first',
      );
    }

    if (
      user.forgetPasswordOTPExpiresAt &&
      user.forgetPasswordOTPExpiresAt < new Date()
    ) {
      // Clear expired OTP
      user.forgetPasswordOTP = undefined;
      user.forgetPasswordOTPExpiresAt = undefined;
      await user.save();
      throw new BadRequestException(
        'OTP has expired. Please request a new one',
      );
    }

    const isOtpValid = await compare(
      resetPasswordDto.otp,
      user.forgetPasswordOTP,
    );
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    // Update password — pre-save hook will hash it automatically
    user.password = resetPasswordDto.newPassword;
    user.forgetPasswordOTP = undefined;
    user.forgetPasswordOTPExpiresAt = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }
}
