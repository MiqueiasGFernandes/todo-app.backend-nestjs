export interface IRemoveListUseCase {
  delete(id: string, userId: string): Promise<void>;
}

export const REMOVE_LIST_USE_CASE = 'RemoveListUseCase';
