import { EmailSentIcon } from './Icons';
import ButtonPrimary from './Buttons/ButtonPrimary';
export default function EmailSent() {
  return (
    <div className="flex flex-col items-center lg:pt-12">
      <EmailSentIcon className="h-32 w-32" />
      <div className="mt-12 flex flex-col items-center">
        <h1 className="text-secondary text-2xl font-bold">Check your Email</h1>
        <p className="text-grayDark mt-4 text-center font-light sm:w-96">
          We've sent a confirmation link to your email. Please verify it to
          activate your account.
        </p>
        <ButtonPrimary type="button" value="Continue" className="mt-12 w-64" />
      </div>
    </div>
  );
}
