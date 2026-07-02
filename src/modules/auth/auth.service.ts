import { Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  register(registerAuthDto: RegisterAuthDto) {
    return 'This action adds a new auth';
  }


}
