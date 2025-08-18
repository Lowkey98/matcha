import { useContext, useState } from 'react';
import InputFormField from '../components/FormFields/InputFormField';
import ButtonPrimary from '../components//Buttons/ButtonPrimary';
import { isValidEmail } from '../../../shared/Helpers';
import { updateEmail } from '../../Api';
import { useToast } from '../hooks/useToast';
import { UserContext } from '../context/UserContext';
import EmailSent from './EmailSent';

export default function UpdateEmail() {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState<string>('');
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const { addToast } = useToast();
  const [showEmailSent, setShowEmailSent] = useState<boolean>(false);

  const [errorEmailAlreadyExists, setErrorEmailAlreadyExists] = useState<
    string | null
  >(null);
  const errorEmail: string | null =
    isValidEmail(email) ?? errorEmailAlreadyExists;
  async function handleClickUpdateEmail() {
    if (!user) {
      return;
    }
    let errorForm: boolean = false;
    if (errorEmail) {
      setFormTrial(true);
      errorForm = true;
    }
    if (!errorForm) {
      updateEmail({ email, id: user.id })
        .then(() => {
          setShowEmailSent(true);
        })
        .catch((error) => {
          const { emailAlreadyExists, usernameAlreadyExists } = error;
          if (emailAlreadyExists)
            setErrorEmailAlreadyExists('Email already exists');
        });
    }
  }

  return (
    <>
      {/* <Helmet>
        <title>Matcha - Login</title>
      </Helmet> */}
      <main className="mx-auto mt-32 flex flex-col justify-center lg:w-96">
        {!showEmailSent ? (
          <div className="">
            <div className="flex flex-col">
              <h1 className="text-secondary text-2xl font-bold">
                Update your email
              </h1>
            </div>
            <form className="mt-12 flex flex-col">
              <div className="flex flex-col gap-8">
                <InputFormField
                  label="Email"
                  placeholder="e.g., john.doe@example.com"
                  setInputValue={setEmail}
                  setFieldAlreadyExists={setErrorEmailAlreadyExists}
                  errorInput={errorEmail}
                  formTrail={formTrail}
                  required
                />
              </div>
              <div className="mt-12 flex flex-col gap-5">
                <ButtonPrimary
                  type="submit"
                  value="update your email"
                  className="w-full"
                  onClick={handleClickUpdateEmail}
                />
              </div>
            </form>
          </div>
        ) : (
          <EmailSent
            message="We've sent a confirmation link to update your email."
            continueButton={false}
          />
        )}
      </main>
    </>
  );
}
