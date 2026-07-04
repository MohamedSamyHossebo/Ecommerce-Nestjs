import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  mixin,
} from '@nestjs/common';
import { UserRoleEnum } from 'src/common/enums/user.enum';

export const RoleGuard = (...roles: UserRoleEnum[]) => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
        throw new UnauthorizedException('User not authenticated');
      }

      if (!roles.includes(user.role)) {
        throw new ForbiddenException(
          `Access denied. Required roles: ${roles.join(', ')}`,
        );
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
};
