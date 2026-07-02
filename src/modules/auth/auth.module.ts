import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { TokenModule } from 'src/common/modules/token/token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModel, TokenModule],
})
export class AuthModule {}
