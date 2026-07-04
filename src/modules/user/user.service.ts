import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/DB/repos/user.repo';
import { UpdateProfileDTO } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getProfile(userId: any) {
    const user = await this.userRepo.findById(userId, '-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async updateProfile(userId: any, updateProfileDto: UpdateProfileDTO) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userRepo.findByIdAndUpdate(
      userId,
      updateProfileDto,
    );
    return updatedUser;
  }
}
