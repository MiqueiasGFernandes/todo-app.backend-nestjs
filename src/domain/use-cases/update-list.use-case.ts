import { ListModel } from '../models';

export interface IUpdateList {
  update(
    id: string,
    data: { [K in keyof ListModel]?: string | number | boolean },
  ): Promise<ListModel>;
}
