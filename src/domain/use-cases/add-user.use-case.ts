import { UserModel } from '@domain/models/user.model';

export interface IAddUserUseCase {
  add(user: UserModel): Promise<UserModel>;
}
