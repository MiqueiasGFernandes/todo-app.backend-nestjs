import { ListModel } from '../models';

export interface IReadListUseCase {
  get(id: string): Promise<ListModel>;
}
