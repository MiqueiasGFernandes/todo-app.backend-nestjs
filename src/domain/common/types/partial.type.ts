export type PartialType<T> = {
  [K in keyof T]?: any;
};
