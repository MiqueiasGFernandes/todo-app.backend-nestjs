import { ListModel } from '../models';

export interface IReadListUseCase {
  get(id: string, userId: string): Promise<ListModel>;
}
