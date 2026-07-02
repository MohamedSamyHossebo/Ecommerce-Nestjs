import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenService } from 'src/common/modules/token/token.security';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType();
    let authorization: string | undefined;

    switch (contextType) {
      case 'http': {
        const request = context.switchToHttp().getRequest();
        authorization = request.headers.authorization;
        break;
      }
      default:
        return false;
    }

    if (!authorization) return false;

    const { user } = await this.tokenService.decodedToken({ authorization });

    const request = context.switchToHttp().getRequest();
    request.user = user;

    return true;
  }
}
