import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { UpdateListService } from '@domain/services/update-list.service';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { MockType } from '../fixtures';

describe('GIVEN finding list', () => {
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
  describe('WHEN update List', () => {
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
  });
});
