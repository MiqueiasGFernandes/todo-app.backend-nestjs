import { ListModel } from '@domain/models';
import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { IAddListUseCase } from '@domain/use-cases';
import { Inject } from '@nestjs/common';

export class AddListService implements IAddListUseCase {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly listRepository: IListRepository,
  ) {}

  async add(data: ListModel): Promise<ListModel> {
    const list: ListModel = await this.listRepository.create(data);

    return list;
  }
}
