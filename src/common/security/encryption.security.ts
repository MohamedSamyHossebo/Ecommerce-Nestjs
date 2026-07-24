import { hash, compare } from 'bcrypt';
import {
  createCipheriv,
  createDecipheriv,
  scryptSync,
  randomBytes,
} from 'crypto';
import * as argon2 from 'argon2';
import { securityEnum } from '../enums/security.enum';

const algorithm = 'aes-256-cbc';
let cachedKey: Buffer | null = null;

const getEncryptionKey = (): Buffer => {
  if (!cachedKey) {
    const secret = process.env.ENCRYPTION_KEY || 'default-secret-key';
    cachedKey = scryptSync(secret, 'salt', 32);
  }
  return cachedKey;
};

export interface GenerateHashArgs {
  plainText: string;
  salt?: string | number;
  algo?: string;
}

export interface VerifyHashArgs {
  plainText: string;
  cipherText: string;
  algo?: string;
}

export const encryptData = (text: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, getEncryptionKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

export const decryptData = (text: string): string => {
  try {
    if (!text || !text.includes(':')) return text;
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    if (iv.length !== 16) return text;
    const decipher = createDecipheriv(algorithm, getEncryptionKey(), iv);
    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (e) {
    return text;
  }
};

export const generateHash = async ({
  plainText,
  salt = process.env.BCRYPT_SALT || 10,
  algo = securityEnum.BCRYPT,
}: GenerateHashArgs) => {
  let hashResult = '';
  const saltValue =
    typeof salt === 'number'
      ? salt
      : !isNaN(Number(salt))
        ? Number(salt)
        : salt;

  switch (algo) {
    case securityEnum.BCRYPT:
      hashResult = await hash(plainText, saltValue);
      break;
    case securityEnum.ARGON2:
      hashResult = await argon2.hash(plainText);
      break;
    default:
      hashResult = await hash(plainText, saltValue);
      break;
  }
  return hashResult;
};

export const verifyHash = async ({
  plainText,
  cipherText,
  algo = securityEnum.BCRYPT,
}: VerifyHashArgs) => {
  let verifyResult = false;
  switch (algo) {
    case securityEnum.BCRYPT:
      verifyResult = await compare(plainText, cipherText);
      break;
    case securityEnum.ARGON2:
      verifyResult = await argon2.verify(cipherText, plainText);
      break;
    default:
      verifyResult = await compare(plainText, cipherText);
      break;
  }
  return verifyResult;
};