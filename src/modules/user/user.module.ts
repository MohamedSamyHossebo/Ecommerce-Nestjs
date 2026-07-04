import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserModel } from 'src/DB/Models/user.model';
import { UserRepository } from 'src/DB/repos/user.repo';
import { TokenModule } from 'src/common/modules/token/token.module';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  imports: [UserModel, TokenModule],
})
export class UserModule {}
