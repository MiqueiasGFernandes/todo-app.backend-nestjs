import { UserModel } from '@domain/models';
import {
  IPasswordEncryptationProtocol,
  IPasswordValidatorProtocol,
  PASSWORD_ENCRYPTATION_PROTOCOL,
  PASSWORD_VALIDATOR_PROTOCOL,
} from '@domain/protocols';
import { IUserRepository, USER_REPOSITORY } from '@domain/repositories';
import { AddUserService } from '@domain/services';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { MockType } from '../fixtures';
import {
  StronglessPasswordException,
  UserAlreadyExistsException,
} from '@domain/exceptions';

describe('GIVE creating new User', () => {
  let addUserService: AddUserService;
  let userRepositoryMock: MockType<IUserRepository>;
  let passwordEncryptationProtocolMock: MockType<IPasswordEncryptationProtocol>;
  let passwordValidatorProtocolMock: MockType<IPasswordValidatorProtocol>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        AddUserService,
        {
          provide: USER_REPOSITORY,
          useFactory: (): MockType<IUserRepository> => ({
            create: jest.fn((data) => data),
            findOneBy: jest.fn((data) => data),
          }),
        },
        {
          provide: PASSWORD_ENCRYPTATION_PROTOCOL,
          useFactory: (): MockType<IPasswordEncryptationProtocol> => ({
            encrypt: jest.fn((data) => data),
          }),
        },
        {
          provide: PASSWORD_VALIDATOR_PROTOCOL,
          useFactory: (): MockType<IPasswordValidatorProtocol> => ({
            validate: jest.fn((data) => data),
          }),
        },
      ],
    }).compile();

    userRepositoryMock = await testingModule.get(USER_REPOSITORY);
    passwordEncryptationProtocolMock = await testingModule.get(
      PASSWORD_ENCRYPTATION_PROTOCOL,
    );
    passwordValidatorProtocolMock = await testingModule.get(
      PASSWORD_VALIDATOR_PROTOCOL,
    );
    addUserService = await testingModule.resolve(AddUserService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('WHEN success', () => {
    test('SHOULD returns a new User with it generated ID', async () => {
      const encryptedPassword = faker.string.alphanumeric();
      const password = '@AceptablePassword2023';

      passwordEncryptationProtocolMock.encrypt.mockResolvedValue(
        encryptedPassword,
      );
      passwordValidatorProtocolMock.validate.mockResolvedValue([]);
      userRepositoryMock.findOneBy.mockResolvedValue(null);
      userRepositoryMock.create.mockImplementation((user) =>
        Promise.resolve({ id: faker.string.uuid(), ...user }),
      );

      const input = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
      } as UserModel;

      const sut = await addUserService.add(input);
      expect(sut).toHaveProperty('id');
      expect(sut).toHaveProperty('password', encryptedPassword);
      expect(passwordValidatorProtocolMock.validate).toHaveBeenCalledWith(
        password,
      );
      expect(passwordEncryptationProtocolMock.encrypt).toHaveBeenCalledWith(
        password,
      );
      expect(userRepositoryMock.create).toHaveBeenCalledWith({
        ...input,
        password: encryptedPassword,
      });
    });
  });
  describe('WHEN informed password does not matches with password policy', () => {
    test('SHOULD throws StronglessPasswordException', async () => {
      const password = '123';

      passwordValidatorProtocolMock.validate.mockReturnValue([
        'password must be grather',
      ]);

      const input = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
      } as UserModel;

      const sut = addUserService.add(input);
      await expect(sut).rejects.toThrow(StronglessPasswordException);
      expect(passwordValidatorProtocolMock.validate).toHaveBeenCalledWith(
        password,
      );
      expect(passwordEncryptationProtocolMock.encrypt).not.toHaveBeenCalled();
      expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });
  });
  describe('WHEN already exists an User with matching email', () => {
    test('SHOULD throws UserAlreadyExistsException', async () => {
      const encryptedPassword = faker.string.alphanumeric();
      const password = '@AceptablePassword2023';

      passwordEncryptationProtocolMock.encrypt.mockResolvedValue(
        encryptedPassword,
      );
      passwordValidatorProtocolMock.validate.mockResolvedValue([]);
      userRepositoryMock.findOneBy.mockResolvedValue({});

      const input = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
      } as UserModel;

      const sut = addUserService.add(input);
      await expect(sut).rejects.toThrow(UserAlreadyExistsException);
      expect(passwordValidatorProtocolMock.validate).toHaveBeenCalledWith(
        password,
      );
      expect(userRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: input.email,
        active: true,
      });
      expect(passwordEncryptationProtocolMock.encrypt).not.toHaveBeenCalled();
      expect(userRepositoryMock.create).not.toHaveBeenCalled();
    });
  });
});
