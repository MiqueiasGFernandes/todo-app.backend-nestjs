import {
  StronglessPasswordException,
  UserAlreadyExistsException,
} from '@domain/exceptions';
import { UserModel } from '@domain/models';
import {
  IPasswordEncryptationProtocol,
  IPasswordValidatorProtocol,
  PASSWORD_ENCRYPTATION_PROTOCOL,
  PASSWORD_VALIDATOR_PROTOCOL,
} from '@domain/protocols';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories';
import { IAddUserUseCase } from '@domain/use-cases';
import { Inject } from '@nestjs/common';

export class AddUserService implements IAddUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_VALIDATOR_PROTOCOL)
    private readonly passwordValidatorProtocol: IPasswordValidatorProtocol,
    @Inject(PASSWORD_ENCRYPTATION_PROTOCOL)
    private readonly passwordEncryptationProtocol: IPasswordEncryptationProtocol,
  ) {}

  async add(data: UserModel): Promise<UserModel> {
    const passwordValidationPatternErrors: string[] =
      this.passwordValidatorProtocol.validate(data.password);

    if (passwordValidationPatternErrors.length > 0) {
      throw new StronglessPasswordException(passwordValidationPatternErrors);
    }

    const activeUserWithMatchingEmail = await this.userRepository.findOneBy({
      email: data.email,
      active: true,
    });

    if (activeUserWithMatchingEmail) {
      throw new UserAlreadyExistsException(data.email);
    }

    data.password = await this.passwordEncryptationProtocol.encrypt(
      data.password,
    );
    data.active = false;

    return this.userRepository.create(data);
  }
}
