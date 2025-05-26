export function isValidEmail(email: string): string | null {
  if (isEmpty(email)) return "This field is required.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return "Email format is incorrect.";
  return null;
}
export function isValidUsername(username: string): string | null {
  if (isEmpty(username)) return "This field is required.";

  return null;
}
export function isValidName(name: string): string | null {
  if (isEmpty(name)) return "This field is required.";
  return null;
}
export function isValidPassword(password: string): string | null {
  if (isEmpty(password)) return "This field is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";

  return null;
}

export function isValidConfirmedPassword({
  password,
  confirmedPassword,
}: {
  password: string;
  confirmedPassword: string;
}): string | null {
  if (isEmpty(confirmedPassword)) return "This field is required.";
  const checkErrorPassword: string | null = isValidPassword(password);
  if (checkErrorPassword || password !== confirmedPassword)
    return "Passwords do not match.";
  return null;
}

export function isValidAge(age: string): string | null {
  if (isEmpty(age)) return "This field is required.";
  if (!/^[0-9]+(\.[0-9]+)?$/.test(age)) return "Enter a valid age.";
  if (Number(age) < 18 || Number(age) > 60)
    return "Enter age between 18 and 60";
  return null;
}

export function isValidGender(gender: string): string | null {
  if (isEmpty(gender)) return "This field is required.";
  return null;
}

export function isValidSexualPreference(
  sexualPreferences: string,
): string | null {
  if (isEmpty(sexualPreferences)) return "This field is required.";
  return null;
}

export function isValidInterests(interests: string): string | null {
  if (isEmpty(interests)) return "This field is required.";
  return null;
}

export function isValidBiography(biography: string): string | null {
  if (isEmpty(biography)) return "This field is required.";
  return null;
}

export function isEmpty(str: string): boolean {
  return str.trim() === "";
}
