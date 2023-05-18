import { ResourceNotFoundException } from '@domain/exceptions';
import { ListModel } from '@domain/models';
import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { ReadListService } from '@domain/services/read-list.service';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { MockType } from '../fixtures';

describe('GIVEN reading List', () => {
  let readListService: ReadListService;
  let listRepositoryMock: MockType<IListRepository>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        ReadListService,
        {
          provide: LIST_REPOSITORY,
          useFactory: (): MockType<IListRepository> => ({
            findOneOrFail: jest.fn((data) => data),
          }),
        },
      ],
    }).compile();

    listRepositoryMock = await testingModule.get(LIST_REPOSITORY);
    readListService = await testingModule.resolve(ReadListService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('WHEN success', () => {
    test('SHOULD returns matching List', async () => {
      const id = faker.string.uuid();
      const userId = faker.string.uuid();

      listRepositoryMock.findOneOrFail.mockResolvedValue({
        id,
        userId,
        description: faker.lorem.words(),
        name: faker.lorem.word(),
      } as ListModel);

      const sut = await readListService.get(id, userId);
      expect(sut).toHaveProperty('id');
      expect(listRepositoryMock.findOneOrFail).toHaveBeenCalledWith({
        id,
        userId,
      });
    });
  });
  describe('WHEN List with mathing user and id is not found', () => {
    test('SHOULD throws ResourceNotFoundException', async () => {
      const id = faker.string.uuid();
      const userId = faker.string.uuid();

      listRepositoryMock.findOneOrFail.mockRejectedValue({});

      const sut = readListService.get(id, userId);
      await expect(sut).rejects.toThrow(ResourceNotFoundException);
    });
  });
});
