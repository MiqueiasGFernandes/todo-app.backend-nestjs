import { ListModel } from '../models';

export interface IReadListUseCase {
  get(id: string, userId: string): Promise<ListModel>;
}

export const READ_LIST_USE_CASE = 'ReadListUseCase';
