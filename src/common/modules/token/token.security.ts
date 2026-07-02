import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

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

//   async verifyTokenAndGetPayload({
//     token,
//     secretKey,
//     options,
//   }: {
//     token: string;
//     secretKey?: string;
//     options?: JwtVerifyOptions;
//   }) {
//     const payload = await this.jwtService.verifyAsync(token, {
//       secret: secretKey,
//       ...options,
//     });
//     return payload;
//   }
}
