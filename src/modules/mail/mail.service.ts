import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailSerivce: MailerService) {}

  async sendVerificationOtp(email: string, otp: string): Promise<void> {
    try {
      await this.mailSerivce.sendMail({
        to: email,
        subject: 'Verification OTP',
        template: './otp',
        context: {
          otp: otp,
        },
      });
      this.logger.log(`Verification OTP email sent to ${email}`);
    } catch (error) {
      this.logger.error('Error sending verification OTP email:', error);
    }
  }
}
