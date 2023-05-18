import { ResourceNotFoundException } from '@domain/exceptions';
import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { RemoveListService } from '@domain/services/remove-list.service';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { MockType } from '../fixtures';

describe('GIVEN removing List', () => {
  let deleteListService: RemoveListService;
  let listRepositoryMock: MockType<IListRepository>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        RemoveListService,
        {
          provide: LIST_REPOSITORY,
          useFactory: (): MockType<IListRepository> => ({
            findOneOrFail: jest.fn((data) => data),
            delete: jest.fn((data) => data),
          }),
        },
      ],
    }).compile();

    listRepositoryMock = await testingModule.get(LIST_REPOSITORY);
    deleteListService = await testingModule.resolve(RemoveListService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('WHEN success', () => {
    test('SHOULD not throws any error', async () => {
      const id = faker.string.uuid();
      const userId = faker.string.uuid();

      listRepositoryMock.findOneOrFail.mockResolvedValue({});
      listRepositoryMock.delete.mockResolvedValue({});

      const sut = deleteListService.delete(id, userId);
      await expect(sut).resolves.not.toThrow();
      expect(listRepositoryMock.delete).toHaveBeenCalledWith({ id, userId });
    });
  });
  describe('WHEN List with mathing user and id is not found', () => {
    test('SHOULD throws ResourceNotFoundException', async () => {
      const id = faker.string.uuid();
      const userId = faker.string.uuid();

      listRepositoryMock.findOneOrFail.mockRejectedValue({});

      const sut = deleteListService.delete(id, userId);
      await expect(sut).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
