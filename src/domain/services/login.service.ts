import { NotAuthorizedException } from '@domain/exceptions/not-authorized.exception';
import {
  IPasswordEncryptationProtocol,
  ITokenProtocol,
  PASSWORD_ENCRYPTATION_PROTOCOL,
  TOKEN_PROTOCOL,
} from '@domain/protocols';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories';
import { ILoginUseCase } from '@domain/use-cases';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class LoginService implements ILoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_ENCRYPTATION_PROTOCOL)
    private readonly passwordEncryptationProtocol: IPasswordEncryptationProtocol,
    @Inject(TOKEN_PROTOCOL)
    private readonly tokenProtocol: ITokenProtocol,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository
      .findOneByOrFail({
        email,
        active: true,
      })
      .catch(() => {
        throw new NotAuthorizedException('Incorrect email or password');
      });

    await this.passwordEncryptationProtocol
      .compare(user.password, password)
      .catch(() => {
        throw new NotAuthorizedException('Incorrect email or password');
      });

    const token = await this.tokenProtocol.encode({ userId: user.id });

    return token;
  }
}
