export function isEmpty(str: string): boolean {
  return str.trim() === '';
}
export function isValidEmail(email: string): string | null {
  if (isEmpty(email)) return 'This field is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Email format is incorrect.';
  return null;
}
export function isValidUsername(username: string): string | null {
  if (isEmpty(username)) return 'This field is required.';

  return null;
}
export function isValidName(name: string): string | null {
  if (isEmpty(name)) return 'This field is required.';
  return null;
}
export function isValidPassword(password: string): string | null {
  if (isEmpty(password)) return 'This field is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';

  return null;
}

export function isValidConfirmedPassword({
  password,
  confirmedPassword,
}: {
  password: string;
  confirmedPassword: string;
}): string | null {
  if (isEmpty(confirmedPassword)) return 'This field is required.';
  const checkErrorPassword: string | null = isValidPassword(password);
  if (checkErrorPassword || password !== confirmedPassword)
    return 'Passwords do not match.';
  return null;
}

export function isValidAge(age: number): string | null {
  if (age === 0) return 'This field is required.';
  if (age < 18 || age > 60) return 'Enter age between 18 and 60';
  return null;
}

export function isValidGender(gender: string): string | null {
  if (isEmpty(gender)) return 'This field is required.';
  return null;
}

export function isValidSexualPreference(
  sexualPreferences: string,
): string | null {
  if (isEmpty(sexualPreferences)) return 'This field is required.';
  return null;
}

export function isValidInterests(interests: string[]): string | null {
  if (!interests.length) return 'This field is required.';
  return null;
}

export function isValidBiography(biography: string): string | null {
  if (isEmpty(biography)) return 'This field is required.';
  return null;
}

export function isValidAddedProfilePicture(
  uploadedBuffersPictures: (string | undefined)[],
) {
  for (let index = 0; index < uploadedBuffersPictures.length; index++) {
    const uploadedBufferPicture = uploadedBuffersPictures[index];
    if (!uploadedBufferPicture) return 'Add atleast five images.';
  }
  return null;
}
