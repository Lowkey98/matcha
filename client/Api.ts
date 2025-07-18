import type {
  CreateProfileRequest,
  CreateProfileResponse,
  LoginRequest,
  RegisterRequest,
  UserInfo,
  UserInfoBase,
} from '../shared/types';

const HOST: string = 'http://localhost:3000';

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
    body: JSON.stringify({
      ...registeredUser,
    }),
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
  const { email, password } = loggedUserInfo;
  const response = await fetch(`${HOST}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
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
    body: JSON.stringify({
      updatedUserAccountInfo,
    }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
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