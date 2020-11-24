export interface ILoginSuccessPayload {
  authToken: string;
  refreshToken: string;
  tokenExpiration: number;
  user: {
    username: string;
    customerId: number;
    userId: string;
  };
}

export interface IUserProfile {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}
