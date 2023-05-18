export interface IPasswordEncryptationProtocol {
  encrypt(password: string): Promise<string>;
}

export const PASSWORD_ENCRYPTATION_PROTOCOL = 'PASSWORD_ENCRYPTATION_PROTOCOL';
