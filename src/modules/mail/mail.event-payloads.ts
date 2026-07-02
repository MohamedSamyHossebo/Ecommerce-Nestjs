export class SendVerificationOtpEvent {
  constructor(
    public readonly email: string,
    public readonly otp: string,
  ) {}
}

export class SendForgetPasswordOtpEvent {
  constructor(
    public readonly email: string,
    public readonly otp: string,
  ) {}
}
