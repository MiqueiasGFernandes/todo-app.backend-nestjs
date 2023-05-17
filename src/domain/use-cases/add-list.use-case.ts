import { ListModel } from '../models';

export interface IAddListUseCase {
  add(list: ListModel): Promise<ListModel>;
}
