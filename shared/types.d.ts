export type UserInfoBase = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};
export type CreateProfileBase = {
  age: number;
  gender: string;
  sexualPreference: string;
  biography: string;
  interests: string[];
};
export type UserInfo = UserInfoBase & {
  age?: number;
  gender?: string;
  sexualPreference?: string;
  biography?: string;
  interests?: string[];
  imagesUrls?: string[];
};

export type UserInfoWithRelation = UserInfo & {
  isLike: boolean;
  isBlock: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = Omit<UserInfoBase, 'id'> & {
  password: string;
};

export type CreateProfileRequest = CreateProfileBase & {
  uploadedBuffersPictures: string[];
  token: string;
};

export type CreateProfileResponse = CreateProfileBase & {
  imagesUrls: string[];
};

export type UpdatedUserProfileInfos = CreateProfileResponse & {
  id: number;
};
export type RelationRequest = {
  actorUserId: number;
  targetUserId: number;
};
