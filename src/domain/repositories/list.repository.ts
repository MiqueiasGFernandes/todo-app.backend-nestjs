import { ListModel } from '@domain/models';

export interface IListRepository {
  create(data: ListModel): Promise<ListModel>;
  find(
    where: { [K in keyof ListModel]?: boolean | number | string },
    options: {
      perPage: number;
      page: number;
      order: { [K in keyof ListModel]?: 'ASC' | 'DESC' };
    },
  ): Promise<ListModel[]>;
  findOneOrFail(where: {
    [K in keyof ListModel]?: boolean | number | string;
  }): Promise<ListModel>;
  delete(where: {
    [K in keyof ListModel]?: boolean | number | string;
  }): Promise<void>;
  update(
    where: { [K in keyof ListModel]?: boolean | number | string },
    newData: { [K in keyof ListModel]?: boolean | number | string },
  ): Promise<void>;
}

export const LIST_REPOSITORY = 'ListRepository';
