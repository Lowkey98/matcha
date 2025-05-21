import { Link } from "react-router-dom";
import { useState } from "react";
import InputFormField from "../components/FormFields/InputFormField";
import PasswordFormField from "../components/FormFields/PasswordFormField";
import ButtonPrimary from "../components//Buttons/ButtonPrimary";
import ButtonSecondaryWithIcon from "../components//Buttons/ButtonSecondaryWithIcon";
import { GoogleIcon } from "../components/Icons";
import { isValidEmail, isValidPassword } from "../../Helpers";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const errorEmail: string | null = isValidEmail(email);

  function handleClickLogin() {
    let errorForm: boolean = false;
    const checkErrorPassword: string | null = isValidPassword(password);
    if (checkErrorPassword) {
      setErrorPassword(checkErrorPassword);
      errorForm = true;
    } else {
      setErrorPassword(null);
      errorForm = false;
    }
    if (errorEmail) {
      setFormTrial(true);
      errorForm = true;
    }
    if (!errorForm) {
      console.log(email, password);
    }
  }

  return (
    <main className="mx-auto flex h-screen min-w-xs flex-col justify-center px-5 lg:max-w-96 lg:px-0">
      <img src="/logo.svg" alt="logo" className="mx-auto w-52" />
      <div className="mt-16">
        <div className="flex flex-col">
          <h1 className="text-secondary text-2xl font-bold">Login</h1>
          <div>
            <span className="lg:text-md text-sm font-light text-gray-300">
              Don't have an account ?
            </span>
            <Link
              to="/register"
              className="text-primary lg:text-md ml-1 border-b text-sm font-medium"
            >
              Sign up
            </Link>
          </div>
        </div>
        <form className="mt-12 flex flex-col">
          <div className="flex flex-col gap-8">
            <InputFormField
              label="Email"
              placeholder="e.g., john.doe@example.com"
              setInputValue={setEmail}
              errorInput={errorEmail}
              formTrail={formTrail}
              required
            />
            <div>
              <PasswordFormField
                label="Password"
                placeholder="Enter your password"
                setPasswordValue={setPassword}
                errorPassword={errorPassword}
                setErrorPassword={setErrorPassword}
                required
              />
              <div className="flex justify-end">
                <Link
                  to="/forgetPassword"
                  className="text-secondary mt-2 border-b-2 pb-1 text-sm"
                >
                  Forget password
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-5">
            <ButtonPrimary
              type="submit"
              value="Login"
              className="w-full"
              onClick={handleClickLogin}
            />

            <ButtonSecondaryWithIcon
              type="button"
              icon={<GoogleIcon className="h-5.5 w-5.5 fill-white" />}
              value="Login with google"
              className="w-full"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
