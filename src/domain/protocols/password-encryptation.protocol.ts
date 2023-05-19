export interface IPasswordEncryptationProtocol {
  encrypt(password: string): Promise<string>;
  compare(password1: string, password2: string): Promise<boolean>;
}

export const PASSWORD_ENCRYPTATION_PROTOCOL = 'PASSWORD_ENCRYPTATION_PROTOCOL';
