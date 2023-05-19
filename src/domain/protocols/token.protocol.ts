export interface ITokenProtocol {
  encode(data: { userId: string }): Promise<string>;
}

export const TOKEN_PROTOCOL = 'TOKEN_PROTOCOL';
