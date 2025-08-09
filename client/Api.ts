import type {
  CreateProfileRequest,
  CreateProfileResponse,
  LoginRequest,
  RegisterRequest,
  RelationRequest,
  UpdatedUserProfileInfos,
  UserInfo,
  UserInfoBase,
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

export async function sendForgotPasswordMail({
  email
}: {
  email: string
}) {
  const response = await fetch(`${HOST}/api/sendForgotPasswordMail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw error
  }
}

export async function saveNewPassword({
  password,
  token
} : {
  password: string,
  token: string
}){
  return fetch(`${HOST}/api/saveNewPassword`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password,
      token
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to save new password');
    }
  });
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
    const jsonResponse = await response.json();
    return jsonResponse as UserInfoWithRelation;
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
