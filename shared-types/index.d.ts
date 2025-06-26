export type UserInfo = {
  created_at: Date;
  verification_token: string;
  id: string;
  age?: number;
  email: string;
  username: string;
  isVerified: boolean;
  password: string;
};
