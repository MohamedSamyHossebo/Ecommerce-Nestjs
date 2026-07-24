import { generateSecret, generateURI, verify } from 'otplib';
import * as qrcode from 'qrcode';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/DB/repos/user.repo';
import {
  generateHash,
  verifyHash,
  encryptData,
  decryptData,
} from 'src/common/security/encryption.security';

@Injectable()
export class TwoFactorService {
  constructor(private UserRepo: UserRepository) {}
  async generateSecret(userId: string, email: string) {
    const secret = generateSecret();
    const otpauthUrl = generateURI({
      issuer: 'E-commerce',
      label: email,
      secret,
    });
    const encryptedSecret = encryptData(secret);
    await this.UserRepo.findByIdAndUpdate(userId, {
      twoFactorSecret: encryptedSecret,
    });
    console.log('[2FA] Generated new secret for user:', userId);
    console.log('[2FA] Plain secret:', secret);
    console.log('[2FA] Encrypted secret in DB:', encryptedSecret);

    const qrCodeDataUrl = await qrcode.toDataURL(otpauthUrl);

    return {
      secret,
      qrCodeDataUrl,
    };
  }
  async enableTwoFactor(userId: string, code: string) {
    const user = await this.UserRepo.findById(userId, '+twoFactorSecret');
    console.log('[2FA Enable] User ID:', userId);
    console.log('[2FA Enable] Raw DB Secret:', user?.twoFactorSecret);
    const secret = user?.twoFactorSecret
      ? decryptData(user.twoFactorSecret)
      : '';
    console.log('[2FA Enable] Decrypted Secret:', secret);
    const cleanCode = code ? String(code).replace(/\s+/g, '').trim() : '';
    console.log('[2FA Enable] Submitted Code (cleaned):', cleanCode);

    let isValid = false;
    try {
      const result = (await verify({ token: cleanCode, secret})) as any;
      console.log('[2FA Enable] otplib verify result:', result);
      isValid = typeof result === 'boolean' ? result : Boolean(result?.valid);
    } catch (e: any) {
      console.error('[2FA Enable] otplib verify exception:', e?.message || e);
      isValid = false;
    }

    if (!isValid) throw new BadRequestException('Invalid code');

    const backupCodes = this.generateBackupCodes();
    const hashedCodes = await Promise.all(
      backupCodes.map((c) => generateHash({ plainText: c })),
    );

    await this.UserRepo.findByIdAndUpdate(userId, {
      twoFactorEnabled: true,
      twoFactorBackupCodes: hashedCodes,
    });

    return { backupCodes }; 
  }

  async verifyTwoFactorCode(userId: string, code: string): Promise<boolean> {
    const user = await this.UserRepo.findById(userId, '+twoFactorSecret');
    if (!user || !user.twoFactorSecret) return false;

    const secret = decryptData(user.twoFactorSecret);
    const cleanCode = code ? String(code).replace(/\s+/g, '').trim() : '';
    try {
      const result = (await verify({
        token: cleanCode,
        secret,
      })) as any;
      return typeof result === 'boolean' ? result : Boolean(result?.valid);
    } catch (e) {
      return false;
    }
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const user = await this.UserRepo.findById(userId, '+twoFactorBackupCodes');
    if (!user || !user.twoFactorBackupCodes?.length) return false;

    for (let i = 0; i < user.twoFactorBackupCodes.length; i++) {
      const isMatch = await verifyHash({
        cipherText: user.twoFactorBackupCodes[i],
        plainText: code,
      });

      if (isMatch) {
        // Remove used backup code
        user.twoFactorBackupCodes.splice(i, 1);
        await this.UserRepo.findByIdAndUpdate(userId, {
          twoFactorBackupCodes: user.twoFactorBackupCodes,
        });
        return true;
      }
    }
    return false;
  }

  async disableTwoFactor(userId: string, code: string) {
    const isValid = await this.verifyTwoFactorCode(userId, code);
    if (!isValid) throw new BadRequestException('Invalid 2FA code');

    await this.UserRepo.findByIdAndUpdate(userId, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorBackupCodes: [],
    });

    return { message: '2FA disabled successfully' };
  }

  private generateBackupCodes(count: number = 10): string[] {
    return Array.from({ length: count }, () =>
      Math.random().toString(36).substring(2, 12).toUpperCase(),
    );
  }
}
