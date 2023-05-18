export class StronglessPasswordException extends Error {
  constructor(errors: string[]) {
    super(
      `Password does not satisfies security patterns: ${errors.join(', ')} `,
    );
    this.name = 'StronglessPasswordException';
  }
}
