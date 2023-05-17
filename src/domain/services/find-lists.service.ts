import { FindOptionsType } from '@domain/common/types';
import { ListModel } from '@domain/models';
import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { IFindListUseCase } from '@domain/use-cases';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FindListsService implements IFindListUseCase {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly listRepository: IListRepository,
  ) {}

  async find(options: FindOptionsType<ListModel>): Promise<ListModel[]> {
    const lists = await this.listRepository.find(options.filters, {
      order: options.order,
      page: options.page,
      perPage: options.perPage,
    });

    return lists;
  }
}
