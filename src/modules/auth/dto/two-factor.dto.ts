import { IsNotEmpty, IsString } from 'class-validator';

export class EnableTwoFactorDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}

export class VerifyTwoFactorLoginDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}

export class DisableTwoFactorDto {
  @IsString()
  @IsNotEmpty()
  code!: string;
}
