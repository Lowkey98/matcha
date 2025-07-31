export type UserInfoBase = {
  id: string;
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
  location: UserLocation;
};
export type UserInfo = UserInfoBase & {
  age?: number;
  gender?: string;
  sexualPreference?: string;
  biography?: string;
  interests?: string[];
  imagesUrls?: string[];
  location?: UserLocation;
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

export type UserLocation = {
  address: string;
  latitude: number;
  longitude: number;
};
export type UpdatedUserProfileInfos = CreateProfileResponse & {
  id: string;
};
export type Sort = {
  name: string;
  sort: 'asc' | 'desc';
};

export type Filter = {
  name: string;
  range: number[];
  min: number;
  max: number;
};
