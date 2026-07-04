import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import type { Request } from 'express';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDTO) {
    const userId = req.user.id;
    return this.userService.updateProfile(userId, updateProfileDto);
  }


}
