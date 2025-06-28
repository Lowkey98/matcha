export type UserInfo = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  created_at: Date;
  verification_token: string;
  isVerified: boolean;
  password: string;
  age?: number;
};
