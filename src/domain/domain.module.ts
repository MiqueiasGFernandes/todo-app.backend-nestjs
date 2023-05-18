import { Module } from '@nestjs/common';
import {
  ADD_LIST_USE_CASE,
  FIND_LIST_USE_CASE,
  READ_LIST_USE_CASE,
  REMOVE_LIST_USE_CASE,
  UPDATE_LIST,
} from './use-cases';
import {
  AddListService,
  FindListsService,
  ReadListService,
  RemoveListService,
  UpdateListService,
} from './services';

@Module({
  providers: [
    {
      provide: ADD_LIST_USE_CASE,
      useClass: AddListService,
    },
    {
      provide: FIND_LIST_USE_CASE,
      useClass: FindListsService,
    },
    {
      provide: READ_LIST_USE_CASE,
      useClass: ReadListService,
    },
    {
      provide: REMOVE_LIST_USE_CASE,
      useClass: RemoveListService,
    },
    {
      provide: UPDATE_LIST,
      useClass: UpdateListService,
    },
  ],
  exports: [
    AddListService,
    FindListsService,
    ReadListService,
    RemoveListService,
    UpdateListService,
  ],
})
export class DomainModule {}
