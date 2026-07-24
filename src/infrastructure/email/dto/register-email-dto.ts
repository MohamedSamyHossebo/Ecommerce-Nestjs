import { IsEmail, IsString } from 'class-validator';

export class RegisterEmailDto {
  @IsEmail()
  to!: string;

  @IsString()
  name!: string;

  @IsString()
  code!: string;
}
