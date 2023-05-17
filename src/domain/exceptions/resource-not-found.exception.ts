export class ResourceNotFoundException extends Error {
  constructor(resource: string, filters: string) {
    super(
      `Resource '${resource}' with values ${filters} not found. Make sure this record witch matching columns exists`,
    );
    this.name = 'ResourceNotFoundException';
  }
}
