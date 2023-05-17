import { TaskModel } from './task.model';

export class ListModel {
  id: string;
  name: string;
  description?: string;
  userId: string;
  tasks: TaskModel[];
}
