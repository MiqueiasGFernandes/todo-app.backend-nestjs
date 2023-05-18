import { ListModel } from '../models';

export interface IAddListUseCase {
  add(list: ListModel): Promise<ListModel>;
}

export const ADD_LIST_USE_CASE = 'AddListUseCase';
