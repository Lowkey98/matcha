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
  fameRate?: number;
  lastOnline: Date;
  isOnline: boolean;
};
export type UserInfoWithCommonTags = UserInfo & {
  commonTagsCount: number;
  distanceBetween: number;
};
export type UserInfoWithRelation = UserInfo & {
  isLike: boolean;
  isViewProfile: boolean;
  isBlock: boolean;
  isOnline: boolean;
  alreadyLiked: boolean;
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
  id: number;
};
export type RelationRequest = {
  actorUserId: number;
  targetUserId: number;
};

export type NotificationResponse = {
  actorUserId: number;
  actorUserImageUrl: string;
  actorUsername: string;
  message: string;
};
export type Sort = {
  name: string;
  sort: 'asc' | 'desc' | null;
};

export type Filter = {
  name: string;
  range: number[];
  min: number;
  max: number;
};

export type ConversationUserInfo = {
  id: number;
  imageUrl: string;
  username: string;
  isOnline: boolean;
  lastOnline: Date;
};

export type UserConversationsSummary = {
  id: number;
  username: string;
  imageUrl: string;
  lastMessage?: string;
  isOnline: boolean;
  lastOnline: Date;
  time: string;
};

export type Message = {
  userId: number;
  description: string;
  time: string;
};

export type MessageRequest = {
  actorUserId: number;
  targetUserId: number;
  message: Message;
};
