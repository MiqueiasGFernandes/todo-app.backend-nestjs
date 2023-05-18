import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { UpdateListService } from '@domain/services/update-list.service';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { MockType } from '../fixtures';
import {
  ResourceNotFoundException,
  UpdateNotAllowedException,
} from '@domain/exceptions';

describe('GIVEN update List', () => {
  let updateListService: UpdateListService;
  let listRepositoryMock: MockType<IListRepository>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        UpdateListService,
        {
          provide: LIST_REPOSITORY,
          useFactory: (): MockType<IListRepository> => ({
            update: jest.fn((data) => data),
            findOneOrFail: jest.fn((data) => data),
          }),
        },
      ],
    }).compile();

    listRepositoryMock = await testingModule.get(LIST_REPOSITORY);
    updateListService = await testingModule.resolve(UpdateListService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('WHEN success', () => {
    test('SHOULD not thrown any error', async () => {
      listRepositoryMock.update.mockResolvedValue({});
      listRepositoryMock.findOneOrFail.mockResolvedValue({});

      const id = faker.string.uuid();
      const userId = faker.string.uuid();
      const data = {
        name: faker.word.verb(),
      };

      const sut = updateListService.update(id, userId, data);

      await expect(sut).resolves.not.toThrow();
      expect(listRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        id,
        userId,
      });
      expect(listRepositoryMock.update).toHaveBeenCalledWith(
        {
          id,
          userId,
        },
        data,
      );
    });
  });
  describe('WHEN matching List does not exists', () => {
    test('SHOULD throws ResourceNotFoundException', async () => {
      listRepositoryMock.findOneOrFail.mockRejectedValue({});

      const sut = updateListService.update(
        faker.string.uuid(),
        faker.string.uuid(),
        {
          name: faker.word.noun(),
        },
      );
      await expect(sut).rejects.toThrow(ResourceNotFoundException);
    });
  });
  describe('WHEN some column is not allowed to change', () => {
    test('SHOULD throws UpdateNotAllowedException', async () => {
      listRepositoryMock.findOneOrFail.mockResolvedValue({});

      const sut = updateListService.update(
        faker.string.uuid(),
        faker.string.uuid(),
        {
          id: faker.word.noun(),
        },
      );
      await expect(sut).rejects.toThrow(UpdateNotAllowedException);
    });
  });
});
