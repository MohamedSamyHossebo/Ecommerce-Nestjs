import { ResendOTPDto } from './dto/resend-otp.dto';
import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from 'src/DB/Models/user.model';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { compare, hash } from 'src/common/security/hash.security';
import { VerifyEmailDto } from './dto/verify-email-dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { verifyHash } from 'src/common/security/encryption.security';
import { TokenService } from 'src/common/modules/token/token.security';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
    private readonly mailService: MailService,
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

    this.mailService.sendVerificationOtp(savedUser.email, otp);
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

    this.mailService.sendVerificationOtp(savedUser.email, otp);
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
}
