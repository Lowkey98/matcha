import { useState } from 'react';
import PasswordFormField from '../components/FormFields/PasswordFormField';
import ButtonPrimary from '../components//Buttons/ButtonPrimary';
import {
  isValidConfirmedPassword,
  isValidPassword,
} from '../../../shared/Helpers';
import { Helmet } from 'react-helmet';
import { saveNewPassword } from '../../Api';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (!token) {
    return <p>Error: No token provided.</p>;
  }
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<
    string | null
  >(null);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  function handleClickResetPassword() {
    if (token === null) {
      // TODO: handle this case properly
      console.error('No token provided');
      return;
    }
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
      console.log(password);
      saveNewPassword({ password, token })
        .then(() => {
          console.log('Password reset successfully');
          setIsPasswordReset(true);
        })
        .catch((error) => {
          console.error('Error resetting password:', error);
          addToast({
            status: 'error',
            message: error.message || 'Failed to reset password',
          });
        });
    }
  }
  function handleClickGotoLogin() {
    console.log('Navigating to login');
    navigate('/login');
  }
  return (
    <>
      <Helmet>
        <title>Matcha - Reset password</title>
      </Helmet>
      {isPasswordReset ? (
        <div className="bg-grayDark bg-opacity-50 fixed top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center">
          <div className="rounded bg-white p-6 text-center shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Password Reset</h2>
            <p className="mb-4">Your password has been reset successfully.</p>
            <ButtonPrimary
              type="button"
              value="OK"
              onClick={handleClickGotoLogin}
              className="w-full"
            />
          </div>
        </div>
      ) : (
        <main className="mx-auto flex h-screen flex-col justify-center lg:w-96">
          <img src="/logo.svg" alt="logo" className="mx-auto w-52" />
          <div className="mt-16">
            <div className="flex flex-col">
              <h1 className="text-secondary text-2xl font-bold">
                Reset password
              </h1>
              <div>
                <span className="lg:text-md text-sm font-light text-gray-300">
                  Enter a new password you'll rememberf
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
      )}
    </>
  );
}
