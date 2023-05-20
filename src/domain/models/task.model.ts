import { ListModel } from './list.model';

export class TaskModel {
  id?: string;
  name: string;
  description?: string;
  done?: boolean;
  listId: string;
  list?: ListModel;
}
