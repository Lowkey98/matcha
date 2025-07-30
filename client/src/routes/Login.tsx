import { Link, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useContext, useState } from 'react';
import InputFormField from '../components/FormFields/InputFormField';
import PasswordFormField from '../components/FormFields/PasswordFormField';
import ButtonPrimary from '../components//Buttons/ButtonPrimary';
import ButtonSecondaryWithIcon from '../components//Buttons/ButtonSecondaryWithIcon';
import { GoogleIcon } from '../components/Icons';
import { isValidEmail, isValidPassword } from '../../../shared/Helpers';
import { getUserInfo, login } from '../../Api';
import { Helmet } from 'react-helmet';
import { useToast } from '../hooks/useToast';
import type { LoginRequest, UserInfo } from '../../../shared/types';
import { UserContext } from '../context/UserContext';
import { BACKEND_STATIC_FOLDER } from '../components/ImagesCarousel';
import { SocketContext } from '../context/SocketContext';

export default function Login() {
  const { setUser, setLoading } = useContext(UserContext);
  const { setSocket } = useContext(SocketContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [formTrail, setFormTrial] = useState<boolean>(false);
  const navigate = useNavigate();
  const { addToast } = useToast();
  const errorEmail: string | null = isValidEmail(email);

  async function handleClickLogin() {
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
      const loggedUserInfo: LoginRequest = {
        email,
        password,
      };
      login({ loggedUserInfo })
        .then((token: string) => {
          if (token) {
            localStorage.setItem('token', token);
            getUserInfo({ token })
              .then((userInfo: UserInfo) => {
                console.log('User data fetched:', userInfo);
                setUser(userInfo);
                setLoading(false);
                if (userInfo.age) {
                  const socketClient = io(BACKEND_STATIC_FOLDER);
                  setSocket(socketClient);
                  socketClient.emit('register', userInfo.id);
                  navigate('/explore');
                } else {
                  navigate('/createProfile');
                }
              })
              .catch((error) => {
                console.error('Error fetching user data:', error.message);
                setUser(null);
                setLoading(false);
              });
          }
        })
        .catch((error) => {
          const errorMessage = error.error;
          if (errorMessage) setErrorPassword(errorMessage);
          else {
            addToast({
              status: 'error',
              message: 'An unexpected error occurred. Please try again.',
            });
          }
        });
    }
  }

  return (
    <>
      <Helmet>
        <title>Matcha - Login</title>
      </Helmet>
      <main className="mx-auto flex h-screen flex-col justify-center lg:w-96">
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
                <div className="mt-2 flex justify-end">
                  <Link
                    to="/forgetPassword"
                    className="text-secondary border-b-2 pb-1 text-sm"
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
    </>
  );
}
