const HOST: string = 'http://localhost:3000';

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
    const errorData = await response.json();
    throw errorData;
  } else {
    const jsonResponse = await response.json();
    const token = jsonResponse.token;
    localStorage.setItem('token', token);
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
