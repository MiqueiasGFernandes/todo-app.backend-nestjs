import { TaskModel } from '../models';

export interface IAddTaskUseCase {
  add(task: TaskModel, listId: string): Promise<TaskModel>;
}
