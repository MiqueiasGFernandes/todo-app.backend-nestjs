export interface IPasswordValidatorProtocol {
  validate(password: string): string[];
}

export const PASSWORD_VALIDATOR_PROTOCOL = 'PASSWORD_VALIDATOR_PROTOCOL';
