import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
import { UpdateProfileDTO } from './dto/update-profile.dto';
import type { Request } from 'express';

interface IRequest extends Request {
  user: {
    _id: string;
    role: string;
  };
}
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('profile')
  async updateProfile(
    @Req() req: IRequest,
    @Body() updateProfileDto: UpdateProfileDTO,
  ) {
    const userId = req.user._id;
    return this.userService.updateProfile(userId, updateProfileDto);
  }
}
