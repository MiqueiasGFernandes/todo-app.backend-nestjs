import { TaskModel } from '@domain/models';

export interface ITaskRepository {
  create(data: TaskModel): Promise<TaskModel>;
}

export const TASK_REPOSITORY = 'TASK_REPOSITORY';
