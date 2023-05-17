import { ResourceNotFoundException } from '@domain/exceptions';
import { IListRepository, LIST_REPOSITORY } from '@domain/repositories';
import { IRemoveListUseCase } from '@domain/use-cases';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RemoveListService implements IRemoveListUseCase {
  constructor(
    @Inject(LIST_REPOSITORY) private readonly listRepository: IListRepository,
  ) {}
  async delete(id: string, userId: string): Promise<void> {
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

    await this.listRepository.delete({
      id,
      userId,
    });
  }
}
