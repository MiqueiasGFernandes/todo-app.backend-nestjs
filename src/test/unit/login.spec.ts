import { LoginService } from '@domain/services';
import { MockType } from '../fixtures';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories';
import {
  IPasswordEncryptationProtocol,
  ITokenProtocol,
  PASSWORD_ENCRYPTATION_PROTOCOL,
  TOKEN_PROTOCOL,
} from '@domain/protocols';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { NotAuthorizedException } from '@domain/exceptions/not-authorized.exception';

describe('GIVING user login', () => {
  let loginService: LoginService;
  let userRepositoryMock: MockType<IUserRepository>;
  let passwordEncryptationProtocolMock: MockType<IPasswordEncryptationProtocol>;
  let tokenProtocolMock: MockType<ITokenProtocol>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: USER_REPOSITORY,
          useFactory: (): MockType<IUserRepository> => ({
            findOneByOrFail: jest.fn((data) => data),
          }),
        },
        {
          provide: PASSWORD_ENCRYPTATION_PROTOCOL,
          useFactory: (): MockType<IPasswordEncryptationProtocol> => ({
            compare: jest.fn((data) => data),
          }),
        },
        {
          provide: TOKEN_PROTOCOL,
          useFactory: (): MockType<ITokenProtocol> => ({
            encode: jest.fn((data) => data),
          }),
        },
      ],
    }).compile();

    userRepositoryMock = await testingModule.get(USER_REPOSITORY);
    tokenProtocolMock = await testingModule.get(TOKEN_PROTOCOL);
    passwordEncryptationProtocolMock = await testingModule.resolve(
      PASSWORD_ENCRYPTATION_PROTOCOL,
    );
    loginService = await testingModule.resolve(LoginService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('WHEN success', () => {
    test('SHOULD jwt encoded token', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const token = faker.string.alphanumeric();

      const userData = {
        id: faker.string.uuid(),
        password,
      };

      userRepositoryMock.findOneByOrFail.mockResolvedValue(userData);
      passwordEncryptationProtocolMock.compare.mockResolvedValue({});
      tokenProtocolMock.encode.mockResolvedValue(token);

      const sut = await loginService.login(email, password);
      expect(userRepositoryMock.findOneByOrFail).toHaveBeenCalledWith({
        email,
        active: true,
      });
      expect(passwordEncryptationProtocolMock.compare).toHaveBeenCalledWith(
        password,
        password,
      );
      expect(tokenProtocolMock.encode).toHaveBeenCalledWith({
        userId: userData.id,
      });
      expect(typeof sut).toBe('string');
    });
  });
  describe('WHEN user with matching email does not exists', () => {
    test('SHOULD thrown NotAuthorizedException', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      userRepositoryMock.findOneByOrFail.mockRejectedValue({});

      const sut = loginService.login(email, password);
      await expect(sut).rejects.toThrow(NotAuthorizedException);
      expect(userRepositoryMock.findOneByOrFail).toHaveBeenCalledWith({
        email,
        active: true,
      });
      expect(passwordEncryptationProtocolMock.compare).not.toHaveBeenCalled();
      expect(tokenProtocolMock.encode).not.toHaveBeenCalled();
    });
  });
  describe('WHEN password does not matches', () => {
    test('SHOULD thrown NotAuthorizedException', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();

      const userData = {
        id: faker.string.uuid(),
        password,
      };

      userRepositoryMock.findOneByOrFail.mockResolvedValue(userData);
      passwordEncryptationProtocolMock.compare.mockRejectedValue({});

      const sut = loginService.login(email, 'any');
      await expect(sut).rejects.toThrow(NotAuthorizedException);
      expect(userRepositoryMock.findOneByOrFail).toHaveBeenCalledWith({
        email,
        active: true,
      });
      expect(passwordEncryptationProtocolMock.compare).toHaveBeenCalledWith(
        password,
        'any',
      );
      expect(tokenProtocolMock.encode).not.toHaveBeenCalled();
    });
  });
});
