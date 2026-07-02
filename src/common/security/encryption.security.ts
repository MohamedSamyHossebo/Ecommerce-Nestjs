import { hash, compare } from "bcrypt";
import * as argon2 from "argon2";
import { securityEnum } from "../enums/security.enum";

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

export const generateHash = async ({
  plainText,
  salt = process.env.BCRYPT_SALT || 10,
  algo = securityEnum.BCRYPT,
}: GenerateHashArgs) => {
  let hashResult = "";
  const saltValue = typeof salt === "number" ? salt : (!isNaN(Number(salt)) ? Number(salt) : salt);

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