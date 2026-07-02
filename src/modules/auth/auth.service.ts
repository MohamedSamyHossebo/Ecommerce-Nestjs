import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from 'src/DB/Models/user.model';
import { Model } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { hash } from 'src/common/security/hash.security';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
    private readonly mailService: MailService,
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
}
