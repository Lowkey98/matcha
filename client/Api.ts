import type {
  ConversationUserInfo,
  CreateProfileRequest,
  CreateProfileResponse,
  LoginRequest,
  Message,
  MessageRequest,
  RegisterRequest,
  RelationRequest,
  UpdatedUserProfileInfos,
  UserConversationsSummary,
  UserInfo,
  UserInfoBase,
  UserInfoWithCommonTags,
  UserInfoWithRelation,
} from '../shared/types';

const HOST: string = 'http://localhost:3000';

export async function getAddress({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  const response = await fetch(url);
  if (response.ok) {
    const jsonResponse = await response.json();
    return `${jsonResponse.address.neighbourhood}, ${jsonResponse.address.city}`;
  } else throw 'Error converting latitude longitude to address';
}

export async function updateEmail({
  email,
  id,
}: {
  email: string;
  id: number;
}) {
  console.log('Updating email:', email);
  const response = await fetch(`${HOST}/api/updateEmail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, id }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}

export async function register({
  registeredUser,
}: {
  registeredUser: RegisterRequest;
}) {
  const response = await fetch(`${HOST}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registeredUser),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}
export async function login({
  loggedUserInfo,
}: {
  loggedUserInfo: LoginRequest;
}): Promise<string> {
  const response = await fetch(`${HOST}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loggedUserInfo),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  } else {
    const jsonResponse = await response.json();
    const token: string = jsonResponse.token;
    return token;
  }
}
export async function createUserProfile({
  userProfileInfo,
}: {
  userProfileInfo: CreateProfileRequest;
}) {
  try {
    const response = await fetch(`${HOST}/api/create-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userProfileInfo.token}`,
      },
      body: JSON.stringify(userProfileInfo),
    });
    const jsonResponse = await response.json();
    const userProfileInfoFromDb: CreateProfileResponse =
      jsonResponse.body as CreateProfileResponse;
    return userProfileInfoFromDb;
  } catch (error) {
    throw error;
  }
}
export async function updateUserAccount({
  updatedUserAccountInfo,
}: {
  updatedUserAccountInfo: UserInfoBase;
}) {
  const response = await fetch(`${HOST}/api/updateAccount`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUserAccountInfo),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}

export async function updateUserProfileInfos({
  updatedUserProfileInfos,
}: {
  updatedUserProfileInfos: UpdatedUserProfileInfos & { token: string };
}) {
  const response = await fetch(`${HOST}/api/updateProfile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUserProfileInfos),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  const jsonResponse = await response.json();
  return jsonResponse as UpdatedUserProfileInfos;
}
export async function getUserInfo({
  token,
}: {
  token: string;
}): Promise<UserInfo> {
  try {
    const response = await fetch(`${HOST}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const jsonResponse = await response.json();
    return jsonResponse as UserInfo;
  } catch (error) {
    throw error;
  }
}

export async function sendForgotPasswordMail({ email }: { email: string }) {
  const response = await fetch(`${HOST}/api/sendForgotPasswordMail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}

export async function saveNewPassword({
  password,
  token,
}: {
  password: string;
  token: string;
}) {
  return fetch(`${HOST}/api/saveNewPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password,
      token,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to save new password');
    }
  });
}
export async function getAllUsers({
  token,
  currentUserId,
}: {
  token: string;
  currentUserId: number;
}) {
  try {
    const response = await fetch(`${HOST}/api/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    const jsonResponse = await response.json();
    return jsonResponse as UserInfoWithCommonTags[];
  } catch (error) {
    throw error;
  }
}

export async function getUserInfoWithRelation({
  actorUserId,
  targetUserId,
  token,
}: RelationRequest & {
  token: string;
}): Promise<UserInfoWithRelation> {
  try {
    const response = await fetch(
      `${HOST}/api/userWithRelation/${actorUserId}/${targetUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) throw await response.json();
    const jsonResponse = await response.json();
    return jsonResponse as UserInfoWithRelation;
  } catch (error) {
    throw error;
  }
}

export async function getConversationUserInfo({
  targetUserId,
  token,
}: {
  targetUserId: number;
  token: string;
}): Promise<ConversationUserInfo> {
  try {
    const response = await fetch(
      `${HOST}/api/conversationUserInfo/${targetUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) throw await response.json();
    const jsonResponse = await response.json();
    return jsonResponse as ConversationUserInfo;
  } catch (error) {
    throw error;
  }
}

export async function getLikes({
  actorUserId,
  token,
}: {
  actorUserId: number;
  token: string;
}): Promise<UserInfo[]> {
  try {
    const response = await fetch(`${HOST}/api/likes/${actorUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    const jsonResponse = await response.json();
    return jsonResponse as UserInfo[];
  } catch (error) {
    throw error;
  }
}
export async function getViewers({
  tagertUserId,
  token,
}: {
  tagertUserId: number;
  token: string;
}): Promise<UserInfo[]> {
  try {
    const response = await fetch(`${HOST}/api/viewers/${tagertUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    const jsonResponse = await response.json();
    return jsonResponse as UserInfo[];
  } catch (error) {
    throw error;
  }
}

export async function getMatches({
  actorUserId,
  token,
}: {
  actorUserId: number;
  token: string;
}): Promise<UserInfo[]> {
  try {
    const response = await fetch(`${HOST}/api/matches/${actorUserId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    const jsonResponse = await response.json();
    return jsonResponse as UserInfo[];
  } catch (error) {
    throw error;
  }
}

export async function getUserConversationsSummary({
  userId,
  token,
}: {
  userId: number;
  token: string;
}): Promise<UserConversationsSummary[]> {
  try {
    const response = await fetch(
      `${HOST}/api/userConversationsSummary/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) throw await response.json();
    const jsonResponse = await response.json();
    return jsonResponse as UserConversationsSummary[];
  } catch (error) {
    throw error;
  }
}

export async function getConversationBetweenTwoUsers({
  actorUserId,
  targetUserId,
  token,
}: {
  actorUserId: number;
  targetUserId: number;
  token: string;
}): Promise<Message[]> {
  try {
    const response = await fetch(
      `${HOST}/api/conversationsBetweenTwoUsers/${actorUserId}/${targetUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) throw await response.json();
    const jsonResponse = await response.json();
    return jsonResponse as Message[];
  } catch (error) {
    throw error;
  }
}

export async function checkTwoUsersMatch({
  actorUserId,
  targetUserId,
  token,
}: {
  actorUserId: number;
  targetUserId: number;
  token: string;
}): Promise<boolean> {
  try {
    const response = await fetch(
      `${HOST}/api/checkTwoUsersMatch/${actorUserId}/${targetUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) throw await response.json();
    const jsonResponse = await response.json();
    return jsonResponse as boolean;
  } catch (error) {
    throw error;
  }
}

export async function like({
  actorUserId,
  targetUserId,
  token,
}: RelationRequest & { token: string }) {
  try {
    await fetch(`${HOST}/api/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actorUserId, targetUserId }),
    });
    return;
  } catch (error) {
    throw error;
  }
}

export async function unlike({
  actorUserId,
  targetUserId,
  token,
}: RelationRequest & { token: string }) {
  try {
    await fetch(`${HOST}/api/unlike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actorUserId, targetUserId }),
    });
    return;
  } catch (error) {
    throw error;
  }
}

export async function veiwProfile({
  actorUserId,
  targetUserId,
  token,
}: RelationRequest & { token: string }) {
  try {
    await fetch(`${HOST}/api/viewProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actorUserId, targetUserId }),
    });
    return;
  } catch (error) {
    throw error;
  }
}

export async function block({
  actorUserId,
  targetUserId,
  token,
}: RelationRequest & { token: string }) {
  try {
    await fetch(`${HOST}/api/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actorUserId, targetUserId }),
    });
    return;
  } catch (error) {
    throw error;
  }
}

export async function sendMessage({
  actorUserId,
  targetUserId,
  message,
  token,
}: MessageRequest & { token: string }) {
  try {
    await fetch(`${HOST}/api/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ actorUserId, targetUserId, message }),
    });
    return;
  } catch (error) {
    throw error;
  }
}
