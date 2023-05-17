import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { AddListService } from '@domain/services/add-list.service';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { MockType } from '../fixtures';
import { ListModel } from '@domain/models';

describe('GIVEN add new list', () => {
  let addListService: AddListService;
  let listRepositoryMock: MockType<IListRepository>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        AddListService,
        {
          provide: LIST_REPOSITORY,
          useFactory: (): MockType<IListRepository> => ({
            create: jest.fn((data) => data),
          }),
        },
      ],
    }).compile();

    listRepositoryMock = await testingModule.get(LIST_REPOSITORY);
    addListService = await testingModule.resolve(AddListService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('WHEN successfully', () => {
    test('SHOULD returns the created list with generated uuid', async () => {
      const listId = faker.string.uuid();

      listRepositoryMock.create.mockImplementation((list) =>
        Promise.resolve({
          id: listId,
          ...list,
        }),
      );

      const input = {
        name: faker.word.verb(),
        userId: faker.string.uuid(),
        description: faker.lorem.words(),
      } as ListModel;

      const sut = await addListService.add(input);
      expect(sut).toHaveProperty('id', listId);
      expect(listRepositoryMock.create).toHaveBeenCalledWith(input);
    });
  });
});
