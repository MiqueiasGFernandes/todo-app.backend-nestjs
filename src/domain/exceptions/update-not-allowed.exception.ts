export class UpdateNotAllowedException extends Error {
  constructor(entityName: string, columns: string[]) {
    super(
      `${
        entityName.charAt(0).toUpperCase() + entityName.slice(1)
      } not allow update columns ${columns.join(', ')}`,
    );
  }
}
