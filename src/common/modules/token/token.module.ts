import { Module } from "@nestjs/common";
import { TokenService } from "./token.security";
import { JwtModule } from "@nestjs/jwt";
import { UserModel } from "src/DB/Models/user.model";

@Module({
    imports:[JwtModule.registerAsync({
        useFactory: () => ({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }),
      }),UserModel],
    providers:[TokenService],
    exports:[TokenService],
})
export class TokenModule {}
