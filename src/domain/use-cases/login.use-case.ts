export interface ILoginUseCase {
  login(email: string, password: string): Promise<string>;
}
