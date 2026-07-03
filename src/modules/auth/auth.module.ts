import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { TokenModule } from 'src/common/modules/token/token.module';
import { UserRepository } from 'src/DB/repos/user.repo';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserRepository],
  imports: [UserModel, TokenModule],
})
export class AuthModule {}
