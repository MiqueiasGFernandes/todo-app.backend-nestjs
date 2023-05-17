export interface IRemoveListUseCase {
  delete(id: string, userId: string): Promise<void>;
}
