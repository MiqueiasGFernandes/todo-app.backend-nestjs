import {
  ResourceNotFoundException,
  UpdateNotAllowedException,
} from '@domain/exceptions';
import { ListModel } from '@domain/models';
import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { IUpdateList } from '@domain/use-cases';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateListService implements IUpdateList {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly listRepository: IListRepository,
  ) {}
  async update(
    id: string,
    userId: string,
    data: {
      id?: string | number | boolean;
      name?: string | number | boolean;
      description?: string | number | boolean;
      userId?: string | number | boolean;
      tasks?: string | number | boolean;
    },
  ): Promise<void> {
    const allowedColumnsToUpdate: (keyof ListModel)[] = ['name', 'description'];

    const columnsToUpdate: (keyof ListModel)[] = Object.keys(
      data,
    ) as (keyof ListModel)[];
    const notAllowedColumns = columnsToUpdate.filter(
      (column) => !allowedColumnsToUpdate.includes(column),
    );

    if (notAllowedColumns.length > 0) {
      throw new UpdateNotAllowedException('list', notAllowedColumns);
    }

    await this.listRepository
      .findOneOrFail({
        id,
        userId,
      })
      .catch(() => {
        throw new ResourceNotFoundException(
          'list',
          `id: ${id} and user id: ${userId}`,
        );
      });

    await this.listRepository.update({ id, userId }, data);
  }
}
