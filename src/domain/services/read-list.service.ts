import { ResourceNotFoundException } from '@domain/exceptions';
import { ListModel } from '@domain/models';
import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { IReadListUseCase } from '@domain/use-cases';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ReadListService implements IReadListUseCase {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly listRepository: IListRepository,
  ) {}
  async get(id: string, userId: string): Promise<ListModel> {
    const list = await this.listRepository.findOneOrFail().catch(() => {
      throw new ResourceNotFoundException(
        'list',
        `id: ${id} and user id: ${userId}`,
      );
    });

    return list;
  }
}
