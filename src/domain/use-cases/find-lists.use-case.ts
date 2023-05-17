import { FindOptionsType } from '../common/types';
import { ListModel } from '../models';

export interface IFindListUseCase {
  find(options: FindOptionsType<ListModel>): Promise<ListModel[]>;
}
