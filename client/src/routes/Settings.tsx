import { Helmet } from 'react-helmet';
import InputFormField from '../components/FormFields/InputFormField';
import PasswordFormField from '../components/FormFields/PasswordFormField';
import { useState } from 'react';
import {
  isValidConfirmedPassword,
  isValidEmail,
  isValidName,
  isValidPassword,
  isValidUsername,
} from '../../Helpers';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import ButtonSecondary from '../components/Buttons/ButtonSecondary';

export default function Settings() {
  const [email, setEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<
    string | null
  >(null);
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const errorEmail: string | null = isValidEmail(email);
  const errorUserName: string | null = isValidUsername(userName);
  const errorFirstName: string | null = isValidName(firstName);
  const errorLastName: string | null = isValidName(lastName);

  function handleClickSaveUserInfo() {
    let errorForm: boolean = false;
    const checkErrorPassword: string | null = isValidPassword(password);
    const checkErrorConfirmPassword: string | null = isValidConfirmedPassword({
      password,
      confirmedPassword: confirmPassword,
    });
    if (checkErrorPassword) {
      setErrorPassword(checkErrorPassword);
      errorForm = true;
    } else {
      setErrorPassword(null);
      errorForm = false;
    }
    if (checkErrorConfirmPassword) {
      setErrorConfirmPassword(checkErrorConfirmPassword);
      errorForm = true;
    } else {
      setErrorConfirmPassword(null);
      errorForm = false;
    }

    if (errorEmail || errorUserName || errorFirstName || errorLastName) {
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
    <>
      <Helmet>
        <title>Matcha - Settings</title>
      </Helmet>
      <main className="mt-12 mb-22 flex justify-center lg:mb-0 lg:ml-57">
        <div className="w-full lg:w-4xl">
          <div>
            <h1 className="text-secondary text-2xl font-bold">Settings</h1>
            <span className="lg:text-md text-sm font-light text-gray-300">
              Manage your account details
            </span>
          </div>
          <form className="mt-12 flex flex-col">
            <div className="flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:justify-between lg:gap-0 lg:gap-y-10">
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
                placeholder="Enter a strong password"
                className="lg:w-[48%]"
                setPasswordValue={setPassword}
                errorPassword={errorPassword}
                setErrorPassword={setErrorPassword}
                required
              />
              <PasswordFormField
                label="Confirm password"
                placeholder="Renter your password"
                className="lg:w-[48%]"
                setPasswordValue={setConfirmPassword}
                errorPassword={errorConfirmPassword}
                setErrorPassword={setErrorConfirmPassword}
                required
              />
            </div>
            <div className="mt-12 flex flex-col gap-5 lg:mt-15 lg:flex-row-reverse lg:gap-3">
              <ButtonPrimary
                type="submit"
                value="Save"
                className="w-full lg:w-38"
                onClick={handleClickSaveUserInfo}
              />
              <ButtonSecondary
                type="button"
                value="Cancel"
                className="w-full lg:w-38"
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
