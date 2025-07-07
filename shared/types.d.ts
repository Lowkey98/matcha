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
  gender?: string;
  sexualPreference?: string;
  interests?: string[]
  imagesUrls?: string[]
};
export type RegisteredUserInfo = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type UpdateUserInfo = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};
