import { ResourceNotFoundException } from '@domain/exceptions';
import { TaskModel } from '@domain/models';
import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import {
  ITaskRepository,
  TASK_REPOSITORY,
} from '@domain/repositories/task.repository';
import { IAddTaskUseCase } from '@domain/use-cases';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AddTaskService implements IAddTaskUseCase {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly listRepository: IListRepository,
    @Inject(TASK_REPOSITORY) private readonly taskRepository: ITaskRepository,
  ) {}
  async add(task: TaskModel, userId: string): Promise<TaskModel> {
    await this.listRepository
      .findOneByOrFail({
        id: task.listId,
        userId,
      })
      .catch(() => {
        throw new ResourceNotFoundException('List', `id = ${task.listId}`);
      });

    return this.taskRepository.create({
      listId: task.listId,
      name: task.name,
      description: task.description,
      done: false,
    });
  }
}
