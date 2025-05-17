import { useState } from "react";
import InputFormField from "../components/FormFields/InputFormField";
import PasswordFormField from "../components/FormFields/PasswordFormField";
import ButtonPrimaryWithIcon from "../components//Buttons/ButtonPrimaryWithIcon";
import ButtonSecondaryWithIcon from "../components//Buttons/ButtonSecondaryWithIcon";
import { AddUserIcon, GoogleIcon } from "../components/Icons";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidUsername,
  isValidConfirmedPassword,
} from "../../Helpers";

export default function Register() {
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const errorEmail: string | null = isValidEmail(email);
  const errorUserName: string | null = isValidUsername(userName);
  const errorFirstName: string | null = isValidName(firstName);
  const errorLastName: string | null = isValidName(lastName);
  const errorPassword: string | null = isValidPassword(password);
  const errorConfirmPassword: string | null = isValidConfirmedPassword({
    password,
    confirmedPassword: confirmPassword,
  });

  function handleClickCreateAccount() {
    let errorForm: boolean = false;
    if (
      errorEmail ||
      errorUserName ||
      errorFirstName ||
      errorLastName ||
      errorPassword ||
      errorConfirmPassword
    ) {
      setFormTrial(true);
      errorForm = true;
    }
    if (!errorForm) {
      console.log(
        email,
        userName,
        firstName,
        lastName,
        password,
        confirmPassword,
      );
    }
  }

  return (
    <main className="mx-auto max-w-3xl min-w-xs px-5 py-12 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:px-0">
      <img src="/logo.svg" alt="logo" className="mx-auto w-52" />
      <div className="mt-16">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h1 className="text-secondary text-2xl font-bold">Sign up</h1>
          <div>
            <span className="lg:text-md text-sm font-light text-gray-300">
              Already have an account ?
            </span>
            <a className="text-primary lg:text-md ml-1 border-b text-sm font-medium">
              Login
            </a>
          </div>
        </div>
        <form className="mt-12 flex flex-col">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:flex-wrap lg:gap-0 lg:gap-y-7">
            <InputFormField
              label="Email"
              placeholder="e.g., john.doe@example.com"
              className="lg:w-[48%]"
              setInputValue={setEmail}
              errorInput={errorEmail}
              formTrail={formTrail}
              required
            />
            <InputFormField
              label="Username"
              placeholder="e.g., johndoe123"
              className="lg:w-[48%]"
              setInputValue={setUserName}
              errorInput={errorUserName}
              formTrail={formTrail}
              required
            />
            <InputFormField
              label="First name"
              placeholder="e.g., johndoe123"
              className="lg:w-[48%]"
              setInputValue={setFirstName}
              errorInput={errorFirstName}
              formTrail={formTrail}
              required
            />
            <InputFormField
              label="Last name"
              placeholder="e.g., johndoe123"
              className="lg:w-[48%]"
              setInputValue={setLastName}
              errorInput={errorLastName}
              formTrail={formTrail}
              required
            />
            <PasswordFormField
              label="Password"
              placeholder="e.g., Enter a strong password"
              className="lg:w-[48%]"
              setPasswordValue={setPassword}
              errorPassword={errorPassword}
              formTrail={formTrail}
              required
            />
            <PasswordFormField
              label="Confirm password"
              placeholder="e.g., Renter your password"
              className="lg:w-[48%]"
              setPasswordValue={setConfirmPassword}
              errorPassword={errorConfirmPassword}
              formTrail={formTrail}
              required
            />
          </div>
          <div className="mt-12 flex flex-col gap-5 lg:flex-row-reverse lg:justify-between lg:gap-0">
            <ButtonPrimaryWithIcon
              type="submit"
              icon={<AddUserIcon className="h-5.5 w-5.5 fill-white" />}
              value="Create account"
              className="lg:w-[48%]"
              onClick={handleClickCreateAccount}
            />
            <ButtonSecondaryWithIcon
              type="button"
              icon={<GoogleIcon className="h-5.5 w-5.5 fill-white" />}
              value="Create account with google"
              className="lg:w-[48%]"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
