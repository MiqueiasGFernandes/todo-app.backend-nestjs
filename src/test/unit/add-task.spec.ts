import {
  IListRepository,
  ITaskRepository,
  LIST_REPOSITORY,
  TASK_REPOSITORY,
} from '@domain/repositories';
import { AddTaskService } from '@domain/services/add-task.service';
import { Test } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { MockType } from '../fixtures';
import { TaskModel } from '@domain/models';
import { ResourceNotFoundException } from '@domain/exceptions';

describe('GIVEN add new task', () => {
  let addTaskService: AddTaskService;
  let taskRepositoryMock: MockType<ITaskRepository>;
  let listRepositoryMock: MockType<IListRepository>;

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      providers: [
        AddTaskService,
        {
          provide: TASK_REPOSITORY,
          useFactory: (): MockType<ITaskRepository> => ({
            create: jest.fn((data) => data),
          }),
        },
        {
          provide: LIST_REPOSITORY,
          useFactory: (): MockType<IListRepository> => ({
            findOneByOrFail: jest.fn((data) => data),
          }),
        },
      ],
    }).compile();

    taskRepositoryMock = await testingModule.get(TASK_REPOSITORY);
    listRepositoryMock = await testingModule.get(LIST_REPOSITORY);
    addTaskService = await testingModule.resolve(AddTaskService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('WHEN successfully', () => {
    test('SHOULD returns the created task with generated uuid', async () => {
      const taskId = faker.string.uuid();
      const userId = faker.string.uuid();
      const listId = faker.string.uuid();

      taskRepositoryMock.create.mockImplementation((task) =>
        Promise.resolve({
          id: taskId,
          ...task,
        }),
      );
      listRepositoryMock.findOneByOrFail.mockResolvedValue({});

      const input = {
        name: faker.word.verb(),
        listId,
        description: faker.lorem.words(),
      } as TaskModel;

      const sut = await addTaskService.add(input, userId);
      expect(sut).toHaveProperty('id', taskId);
      expect(taskRepositoryMock.create).toHaveBeenCalledWith({
        ...input,
        done: false,
      });
      expect(listRepositoryMock.findOneByOrFail).toHaveBeenCalledWith({
        userId,
        id: listId,
      });
    });
  });
  describe('WHEN list with matching id does not exists', () => {
    test('SHOULD throws ResourceNotFoundException', async () => {
      const taskId = faker.string.uuid();
      const userId = faker.string.uuid();
      const listId = faker.string.uuid();

      taskRepositoryMock.create.mockImplementation((task) =>
        Promise.resolve({
          id: taskId,
          ...task,
        }),
      );
      listRepositoryMock.findOneByOrFail.mockRejectedValue({});

      const input = {
        name: faker.word.verb(),
        listId,
        description: faker.lorem.words(),
      } as TaskModel;

      const sut = addTaskService.add(input, userId);
      await expect(sut).rejects.toThrow(ResourceNotFoundException);
      expect(taskRepositoryMock.create).not.toHaveBeenCalled();
      expect(listRepositoryMock.findOneByOrFail).toHaveBeenCalledWith({
        userId,
        id: listId,
      });
    });
  });
});
