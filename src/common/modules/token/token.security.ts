import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import {
  TOKEN_TYPE_ENUM,
  SIGNATURE_ENUM,
} from 'src/common/enums/security.enum';
import { InjectModel } from '@nestjs/mongoose';
import { User, HUserDocument } from 'src/DB/Models/user.model';
import { Model } from 'mongoose';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<HUserDocument>,
  ) {}

  async generateToken({
    payload,
    options,
    secret,
  }: {
    payload: Object;
    options: JwtSignOptions;
    secret: string;
  }) {
    options.secret = secret;
    const token = await this.jwtService.signAsync(payload, options);
    return token;
  }

  async verifyToken({ token, secret }: { token: string; secret: string }) {
    const payload = await this.jwtService.verifyAsync(token, { secret });
    return payload;
  }

  async decodedToken({
    authorization,
    tokenType = TOKEN_TYPE_ENUM.ACCESS,
  }: {
    authorization: string | undefined;
    tokenType?: number;
  }) {
    if (!authorization) {
      throw new UnauthorizedException({
        message: 'Authorization header is required',
      });
    }

    const [prefix, token] = authorization.split(' ');
    if (!prefix || !token) {
      throw new UnauthorizedException({
        message: 'Invalid Authorization header',
      });
    }

    const signatureLevel =
      prefix === SIGNATURE_ENUM.ADMIN ? SIGNATURE_ENUM.ADMIN : SIGNATURE_ENUM.USER;
    const signature = await this.getSignature({ signatureLevel });
    const decoded = await this.verifyToken({
      token,
      secret:
        tokenType === TOKEN_TYPE_ENUM.ACCESS
          ? signature.accessSignature
          : signature.refreshSignature,
    });

    const user = await this.userModel.findOne({
      _id: decoded._id,
      confirmEmail: { $exists: true, $ne: null },
    });

    if (!user) {
      throw new UnauthorizedException({
        message: 'User not found or email not verified',
      });
    }
    return { user };
  }
  async getSignature({ signatureLevel }: { signatureLevel: string }) {
    switch (signatureLevel) {
      case SIGNATURE_ENUM.ADMIN:
        return {
          accessSignature: process.env.JWT_ADMIN_ACCESS_SIGNUTURE || 'admin_secret',
          refreshSignature:
            process.env.JWT_ADMIN_REFRESH_SIGNUTURE || 'admin_refresh_secret',
        };
      case SIGNATURE_ENUM.USER:
      default:
        return {
          accessSignature: process.env.JWT_ACCESS_SIGNUTURE || 'user_secret',
          refreshSignature:
            process.env.JWT_REFRESH_SIGNUTURE || 'user_refresh_secret',
        };
    }
  }
}
