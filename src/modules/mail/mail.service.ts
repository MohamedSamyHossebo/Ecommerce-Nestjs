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

  @OnEvent(MailEvents.SEND_VERIFICATION_OTP, { async: true })
  async handleSendVerificationOtp(event: SendVerificationOtpEvent): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: event.email,
        subject: 'Verification OTP',
        template: './otp',
        context: {
          otp: event.otp,
          expiresIn: '10 minutes',
        },
      });
      this.logger.log(`Verification OTP email sent to ${event.email}`);
    } catch (error) {
      this.logger.error('Error sending verification OTP email:', error);
    }
  }

  @OnEvent(MailEvents.SEND_FORGET_PASSWORD_OTP, { async: true })
  async handleSendForgetPasswordOtp(event: SendForgetPasswordOtpEvent): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: event.email,
        subject: 'Reset Your Password',
        template: './forget-password',
        context: {
          otp: event.otp,
          expiresIn: '10 minutes',
        },
      });
      this.logger.log(`Forget password OTP email sent to ${event.email}`);
    } catch (error) {
      this.logger.error('Error sending forget password OTP email:', error);
    }
  }
}
