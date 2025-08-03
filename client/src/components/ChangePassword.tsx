import { useState } from 'react';
import PasswordFormField from './FormFields/PasswordFormField';
import ButtonPrimaryWithIcon from './Buttons/ButtonPrimaryWithIcon';
import { AddUserIcon } from './Icons';
import { isValidConfirmedPassword, isValidPassword } from '../../../shared/Helpers';

export function ChangePassword() {
  // get token from params
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (!token) {
    return <p>Error: No token provided.</p>;
  }
  console.log('Token:', token);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<
    string | null
  >(null);
  function handleClickSaveNewPassword() {
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
    if (errorForm) return;

       saveNewPassword({ password , token});
  }
  return (
    <>
      <h1>Enter your new password</h1>
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
      <ButtonPrimaryWithIcon
        type="submit"
        // icon={<AddUserIcon className="h-5.5 w-5.5 fill-white" />}
        value="confirm new password"
        className="w-full lg:w-[48%] mt-8"
        onClick={handleClickSaveNewPassword}
      />
    </>
  );
}
