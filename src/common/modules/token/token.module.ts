import { Module } from "@nestjs/common";
import { TokenService } from "./token.security";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports:[JwtModule.registerAsync({
        useFactory: () => ({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }),
      })],
    providers:[TokenService],
    exports:[TokenService],
})
export class TokenModule {}
