import { useState } from "react";
import PasswordFormField from "../components/FormFields/PasswordFormField";
import ButtonPrimary from "../components//Buttons/ButtonPrimary";
import { isValidConfirmedPassword, isValidPassword } from "../../Helpers";
import { Helmet } from "react-helmet";

export default function ResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<
    string | null
  >(null);

  function handleClickResetPassword() {
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
    if (!errorForm) {
      console.log(email, password);
    }
  }

  return (
    <>
      <Helmet>
        <title>Matcha - Not found</title>
      </Helmet>
      <main className="mx-auto flex h-screen min-w-xs flex-col justify-center px-5 lg:max-w-96 lg:px-0">
        <img src="/logo.svg" alt="logo" className="mx-auto w-52" />
        <div className="mt-16">
          <div className="flex flex-col">
            <h1 className="text-secondary text-2xl font-bold">
              Reset password
            </h1>
            <div>
              <span className="lg:text-md text-sm font-light text-gray-300">
                Enter a new password you'll remember
              </span>
            </div>
          </div>
          <form className="mt-12 flex flex-col">
            <div className="flex flex-col gap-8">
              <PasswordFormField
                label="Password"
                placeholder="Enter your password"
                setPasswordValue={setPassword}
                errorPassword={errorPassword}
                setErrorPassword={setErrorPassword}
                required
              />
              <PasswordFormField
                label="Confirm password"
                placeholder="Renter your password"
                setPasswordValue={setConfirmPassword}
                errorPassword={errorConfirmPassword}
                setErrorPassword={setErrorConfirmPassword}
                required
              />
            </div>
            <div className="mt-12 flex flex-col gap-5">
              <ButtonPrimary
                type="submit"
                value="Reset"
                className="w-full"
                onClick={handleClickResetPassword}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
