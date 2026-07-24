import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { MailEvents } from './mail.events';
import {
  SendForgetPasswordOtpEvent,
  SendVerificationOtpEvent,
} from './mail.event-payloads';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  // We are keeping @OnEvent temporarily if it's used elsewhere, 
  // but changing properties to match RegisterEmailDto format
  @OnEvent(MailEvents.SEND_VERIFICATION_OTP, { async: true })
  async handleSendVerificationOtp(event: any): Promise<void> {
    try {
      const to = event.email || event.to;
      const otp = event.otp || event.code;
      await this.mailerService.sendMail({
        to: to,
        subject: 'Verification OTP',
        template: './otp',
        context: {
          otp: otp,
          expiresIn: '10 minutes',
        },
      });
      this.logger.log(`Verification OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error('Error sending verification OTP email:', error);
    }
  }

  @OnEvent(MailEvents.SEND_FORGET_PASSWORD_OTP, { async: true })
  async handleSendForgetPasswordOtp(event: any): Promise<void> {
    try {
      const to = event.email || event.to;
      const otp = event.otp || event.code;
      await this.mailerService.sendMail({
        to: to,
        subject: 'Reset Your Password',
        template: './forget-password',
        context: {
          otp: otp,
          expiresIn: '10 minutes',
        },
      });
      this.logger.log(`Forget password OTP email sent to ${to}`);
    } catch (error) {
      this.logger.error('Error sending forget password OTP email:', error);
    }
  }
}
