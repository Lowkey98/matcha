import { Helmet } from 'react-helmet';
import InputFormField from '../components/FormFields/InputFormField';
import { useContext, useEffect, useState } from 'react';
import { isValidEmail, isValidName, isValidUsername } from '../../Helpers';
import ButtonPrimary from '../components/Buttons/ButtonPrimary';
import ButtonSecondary from '../components/Buttons/ButtonSecondary';
import { UserContext } from '../Root';
import { UpdateUserInfo, UserInfo } from '../../../shared-types';

export default function Settings() {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const [errorEmailAlreadyExists, setErrorEmailAlreadyExists] = useState<
    string | null
  >(null);
  const [errorUsernameAlreadyExists, setErrorUsernameAlreadyExists] = useState<
    string | null
  >(null);
  const errorEmail: string | null =
    isValidEmail(email) ?? errorEmailAlreadyExists;
  const errorUsername: string | null =
    isValidUsername(username) ?? errorUsernameAlreadyExists;
  const errorFirstName: string | null = isValidName(firstName);
  const errorLastName: string | null = isValidName(lastName);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setUsername(user.username);
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);

  async function handleClickSaveUserInfo() {
    if (user) {
      let errorForm: boolean = false;
      setFormTrial(true);
      if (errorEmail || errorUsername || errorFirstName || errorLastName) {
        errorForm = true;
      }
      if (!errorForm) {
        const updatedUserAccountInfo: UpdateUserInfo = {
          id: user.id,
          email,
          username,
          firstName,
          lastName,
        };
        const response = await fetch('http://localhost:3000/api/editAccount', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updatedUserAccountInfo,
          }),
        });
        if (!response.ok) {
          const { emailAlreadyExists, usernameAlreadyExists } =
            await response.json();

          if (emailAlreadyExists)
            setErrorEmailAlreadyExists('Email already exists');
          if (usernameAlreadyExists)
            setErrorUsernameAlreadyExists('Username already exists');
        } else {
          console.log('done');
        }
      }
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
                setFieldAlreadyExists={setErrorEmailAlreadyExists}
                defaultValue={email}
                required
              />
              <InputFormField
                label="Username"
                placeholder="e.g., johndoe123"
                className="lg:w-[48%]"
                setInputValue={setUsername}
                errorInput={errorUsername}
                formTrail={formTrail}
                setFieldAlreadyExists={setErrorUsernameAlreadyExists}
                defaultValue={username}
                required
              />
              <InputFormField
                label="First name"
                placeholder="e.g., johndoe123"
                className="lg:w-[48%]"
                setInputValue={setFirstName}
                errorInput={errorFirstName}
                formTrail={formTrail}
                defaultValue={firstName}
                required
              />
              <InputFormField
                label="Last name"
                placeholder="e.g., johndoe123"
                className="lg:w-[48%]"
                setInputValue={setLastName}
                errorInput={errorLastName}
                formTrail={formTrail}
                defaultValue={lastName}
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
