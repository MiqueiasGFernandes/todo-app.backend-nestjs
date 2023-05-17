import { ListModel } from '../models';

export interface IUpdateList {
  update(
    id: string,
    userId: string,
    data: { [K in keyof ListModel]?: string | number | boolean },
  ): Promise<void>;
}
