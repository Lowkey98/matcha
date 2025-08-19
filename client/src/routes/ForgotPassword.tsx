import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLongLeftIcon, PasswordIcon } from '../components/Icons';
import { isValidEmail } from '../../../shared/Helpers';
import InputFormField from '../components/FormFields/InputFormField';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import { Helmet } from 'react-helmet';
import { sendForgotPasswordMail } from '../../Api';
import EmailSent from '../components/EmailSent';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [errorEmailDoesntExist, setEmailDoesntExist] = useState<string | null>(
    null,
  );
  const errorEmail: string | null =
    isValidEmail(email) ?? errorEmailDoesntExist;

  function handleClickResetPassword() {
    let errorForm: boolean = false;
    setFormTrial(true);
    if (errorEmail) {
      errorForm = true;
    }
    if (!errorForm) {
      sendForgotPasswordMail({
        email,
      })
        .then(() => {
          setIsEmailSent(true);
        })
        .catch(() => {
          setEmailDoesntExist("This email doesn't exist.");
        });
    }
  }
  return (
    <>
      <Helmet>
        <title>Matcha - Forgot password</title>
      </Helmet>
      {isEmailSent ? (
        <EmailSent
          message="We've sent a reset password link to your email. Please verify it to
                 reset your password."
          continueButton={true}
        />
      ) : (
        <main className="mt-12 flex flex-col items-center lg:mx-auto lg:w-[26rem]">
          <PasswordIcon className="h-26 w-26" />
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-secondary text-center text-xl font-bold sm:text-2xl">
              Forgot your password ?
            </h1>
            <p className="text-grayDark mt-4 text-center font-light sm:w-[21rem]">
              Enter your email address below and we’ll send you a link to reset
              your password.
            </p>
          </div>
          <form
            className={`relative mt-12 flex w-full gap-2 ${formTrail && errorEmail ? 'items-center' : 'items-end'}`}
          >
            <InputFormField
              label="Email"
              placeholder="e.g., john.doe@example.com"
              setInputValue={setEmail}
              errorInput={errorEmail}
              formTrail={formTrail}
              className="flex-1"
              required={true}
              setFieldAlreadyExists={setEmailDoesntExist}
            />
            <ButtonPrimary
              type="submit"
              value="Reset"
              onClick={handleClickResetPassword}
              className={`w-24 ${formTrail && errorEmail ? 'mt-1' : ''}`}
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
      )}
    </>
  );
}
