import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { FindListsService } from '@domain/services/find-lists.service';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { MockType } from '../fixtures';
import { ListModel } from '@domain/models';

describe('GIVEN finding list', () => {
  let findListService: FindListsService;
  let listRepositoryMock: MockType<IListRepository>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        FindListsService,
        {
          provide: LIST_REPOSITORY,
          useFactory: (): MockType<IListRepository> => ({
            find: jest.fn((data) => data),
          }),
        },
      ],
    }).compile();

    listRepositoryMock = await testingModule.get(LIST_REPOSITORY);
    findListService = await testingModule.resolve(FindListsService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('WHEN listening records', () => {
    test('SHOULD returns the lists array', async () => {
      listRepositoryMock.find.mockResolvedValue([
        {
          name: faker.word.noun(),
          userId: faker.string.uuid(),
        },
      ] as ListModel[]);

      const sut = await findListService.find({
        page: 1,
        perPage: 10,
        order: {
          name: 'ASC',
        },
        filters: {},
      });
      expect(sut.length).toBe(1);
    });
  });
});
