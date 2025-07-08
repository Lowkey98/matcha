import type { RegisteredUserInfo, UpdateUserInfo } from '../shared/types';

const HOST: string = 'http://localhost:3000';

export async function register({
  registeredUser,
}: {
  registeredUser: RegisteredUserInfo;
}) {
  const response = await fetch(`${HOST}/api/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registeredUser,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
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
    const token = jsonResponse.token;
    localStorage.setItem('token', token);
  }
}
export async function createUserProfile({
  age,
  gender,
  sexualPreference,
  interests,
  biography,
  uploadedBuffersPictures,
  token,
}: {
  age: number;
  gender: string;
  sexualPreference: string;
  interests: string[];
  biography: string;
  uploadedBuffersPictures: string[];
  token: string;
}) {
  try {
    const response = await fetch(`${HOST}/api/create-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        age,
        gender,
        sexualPreference,
        interests,
        biography,
        uploadedBuffersPictures,
      }),
    });
    const jsonResponse = await response.json();
    return { userInfo: jsonResponse.body, message: jsonResponse.message };
  } catch (error) {
    throw error;
  }
}
export async function updateUserInfoAccount({
  updatedUserAccountInfo,
}: {
  updatedUserAccountInfo: UpdateUserInfo;
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

export async function getUserInfo({ token }: { token: string }) {
  try {
    const response = await fetch(`${HOST}/api/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  } catch (error) {
    throw error;
  }
}
