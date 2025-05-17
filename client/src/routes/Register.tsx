import InputFormField from "../components/FormFields/InputFormField";
import PasswordFormField from "../components/FormFields/PasswordFormField";
import ButtonPrimaryWithIcon from "../components//Buttons/ButtonPrimaryWithIcon";
import ButtonSecondaryWithIcon from "../components//Buttons/ButtonSecondaryWithIcon";
import { AddUserIcon, GoogleIcon } from "../components/Icons";

export default function Register() {
  return (
    <main className="mx-auto max-w-3xl min-w-xs px-5 py-12 lg:flex lg:h-screen lg:flex-col lg:px-0 lg:justify-center">
      <img src="/logo.svg" alt="logo" className="mx-auto w-52" />
      <div className="mt-16">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <h1 className="text-secondary text-2xl font-bold">Sign up</h1>
          <div>
            <span className="lg:text-md text-sm font-light text-gray-300">
              Already have an account ?
            </span>
            <a className="text-primary lg:text-md ml-1 border-b text-sm font-medium">
              Login
            </a>
          </div>
        </div>
        <form className="mt-12 flex flex-col">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:flex-wrap lg:gap-0 lg:gap-y-7">
            <InputFormField
              label="Email"
              placeholder="e.g., john.doe@example.com"
              className="lg:w-[48%]"
            />
            <InputFormField
              label="Username"
              placeholder="e.g., johndoe123"
              className="lg:w-[48%]"
            />
            <InputFormField
              label="First name"
              placeholder="e.g., johndoe123"
              className="lg:w-[48%]"
            />
            <InputFormField
              label="Last name"
              placeholder="e.g., johndoe123"
              className="lg:w-[48%]"
            />
            <PasswordFormField
              label="Password"
              placeholder="e.g., Enter a strong password"
              className="lg:w-[48%]"
            />
            <PasswordFormField
              label="Confirm password"
              placeholder="e.g., Renter your password"
              className="lg:w-[48%]"
            />
          </div>
          <div className="mt-12 flex flex-col gap-5 lg:flex-row-reverse lg:justify-between lg:gap-0">
            <ButtonPrimaryWithIcon
              type="submit"
              icon={<AddUserIcon className="h-5.5 w-5.5 fill-white" />}
              value="Create account"
              className="lg:w-[48%]"
            />
            <ButtonSecondaryWithIcon
              type="button"
              icon={<GoogleIcon className="h-5.5 w-5.5 fill-white" />}
              value="Create account with google"
              className="lg:w-[48%]"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
