import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from 'src/DB/Models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existingUser = await this.userModel.findOne({
      email: registerAuthDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const newUser = new this.userModel({
      ...registerAuthDto,
    }).save();

    return newUser;
  }
}
