import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLongLeftIcon, PasswordIcon } from "../components/Icons";
import { isValidEmail } from "../../Helpers";
import InputFormField from "../components/FormFields/InputFormField";
import ButtonPrimary from "../components/Buttons/ButtonPrimary";
import { Helmet } from "react-helmet";

export default function ForgetPassword() {
  const [email, setEmail] = useState<string>("");
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const errorEmail: string | null = isValidEmail(email);
  function handleClickResetPassword() {
    let errorForm: boolean = false;
    if (errorEmail) {
      setFormTrial(true);
      errorForm = true;
    }
    if (!errorForm) {
      console.log(email);
    }
  }
  return (
    <>
      <Helmet>
        <title>Matcha - Forget password</title>
      </Helmet>
      <main className="mx-auto mt-12 flex min-w-xs flex-col items-center px-5 lg:max-w-[26rem] lg:px-0">
        <PasswordIcon className="h-26 w-26" />
        <div className="mt-12 flex flex-col items-center">
          <h1 className="text-secondary text-center text-xl font-bold sm:text-2xl">
            Forget your password ?
          </h1>
          <p className="text-grayDark mt-4 text-center font-light sm:w-[21rem]">
            Enter your email address below and we’ll send you a link to reset
            your password.
          </p>
        </div>
        <form
          className={`relative mt-12 flex w-full gap-2 ${formTrail && errorEmail ? "items-center" : "items-end"}`}
        >
          <InputFormField
            label="Email"
            placeholder="e.g., john.doe@example.com"
            setInputValue={setEmail}
            errorInput={errorEmail}
            formTrail={formTrail}
            className="flex-1"
          />
          <ButtonPrimary
            type="submit"
            value="Reset"
            onClick={handleClickResetPassword}
            className={`w-24 ${formTrail && errorEmail ? "mt-1" : ""}`}
          />
          <div className="absolute -bottom-12 flex w-full">
            <Link
              to="/login"
              className="text-secondary flex items-center gap-2 text-sm"
            >
              <ArrowLongLeftIcon className="fill-secondary h-6 w-6" />
              <span>Back to login</span>
            </Link>
          </div>
        </form>
      </main>
    </>
  );
}
