import InputFormField from "../components/FormFields/InputFormField";
import PasswordFormField from "../components/FormFields/PasswordFormField";
import ButtonPrimaryWithIcon from "../components//Buttons/ButtonPrimaryWithIcon";
import ButtonSecondaryWithIcon from "../components//Buttons/ButtonSecondaryWithIcon";
import { AddUserIcon, GoogleIcon } from "../components/Icons";

export default function Register() {
  return (
    <main className="min-w-xs px-5 py-12">
      <img src="/logo.svg" alt="logo" className="mx-auto w-52" />
      <div className="mt-16">
        <div>
          <h1 className="text-secondary text-2xl font-bold">Sign up</h1>
          <div>
            <span className="text-sm font-light text-gray-300">
              Already have an account ?
            </span>
            <a className="text-primary ml-1 border-b text-sm font-medium">
              Login
            </a>
          </div>
        </div>
        <form className="mt-12 flex flex-col">
          <div className="flex flex-col gap-8">
            <InputFormField
              label="Email"
              placeholder="e.g., john.doe@example.com"
            />
            <InputFormField label="Username" placeholder="e.g., johndoe123" />
            <InputFormField label="First name" placeholder="e.g., johndoe123" />
            <InputFormField label="Last name" placeholder="e.g., johndoe123" />
            <PasswordFormField
              label="Password"
              placeholder="e.g., Enter a strong password"
            />
            <PasswordFormField
              label="Confirm password"
              placeholder="e.g., Renter your password"
            />
          </div>
          <div className="mt-12 flex flex-col gap-5">
            <ButtonPrimaryWithIcon
              type="submit"
              icon={<AddUserIcon className="h-5.5 w-5.5 fill-white" />}
              value="Create account"
            />
            <ButtonSecondaryWithIcon
              type="button"
              icon={<GoogleIcon className="h-5.5 w-5.5 fill-white" />}
              value="Create account with google"
            />
          </div>
        </form>
      </div>
    </main>
  );
}
