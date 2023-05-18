import { TaskModel } from '../models';

export interface IAddTaskUseCase {
  add(task: TaskModel, listId: string): Promise<TaskModel>;
}

export const ADD_TASK_USE_CASE = 'AddTaskUseCase';
