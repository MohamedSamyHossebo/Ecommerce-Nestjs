import { Module } from '@nestjs/common';
import { TwoFactorService } from 'src/common/services/2fa/two-factor.service';
import { UserModel } from 'src/DB/Models/user.model';
import { UserRepository } from 'src/DB/repos/user.repo';

@Module({
  imports: [UserModel],
  providers: [TwoFactorService, UserRepository],
  exports: [TwoFactorService],
})
export class TwoFactorModule {}
