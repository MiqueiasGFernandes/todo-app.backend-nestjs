import { PartialType } from '@domain/common/types/partial.type';
import { UserModel } from '@domain/models/user.model';

export interface IUserRepository {
  findOneByOrFail(where: PartialType<UserModel>): Promise<UserModel>;
  findOneBy(where: PartialType<UserModel>): Promise<UserModel>;
  create(data: UserModel): Promise<UserModel>;
}

export const USER_REPOSITORY = 'UserRepository';
