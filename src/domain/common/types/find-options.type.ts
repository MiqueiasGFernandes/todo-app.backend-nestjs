export type FindOptionsType<T> = {
  page: number;
  perPage: number;
  order: { [K in keyof T]: 'ASC' | 'DESC' };
  filters: { [K in keyof T]: string | number | boolean };
};
