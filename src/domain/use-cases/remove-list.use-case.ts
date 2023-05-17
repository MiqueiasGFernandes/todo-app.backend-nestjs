import { ListModel } from '../models';

export interface IRemoveListUseCase {
  delete(id: string): Promise<ListModel>;
}
