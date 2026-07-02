import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from 'src/DB/Models/user.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModel],
})
export class AuthModule {}
