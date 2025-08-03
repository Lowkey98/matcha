import { useSearchParams } from 'react-router-dom';
import { EmailSentIcon } from './Icons';
import LinkPrimary from './Links/LinkPrimary';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  return status === 'success' ? (
    <div className="flex flex-col items-center lg:pt-12">
      <EmailSentIcon className="h-32 w-32" />
      <div className="mt-12 flex flex-col items-center">
        <h1 className="text-secondary text-2xl font-bold">Email Verified Successfully!</h1>
        <p className="text-grayDark mt-4 text-center font-light sm:w-96">
          Click Continue to login
        </p>
        <LinkPrimary to="/login" value="Continue" className="mt-12 w-64" />
      </div>
    </div>
  ) : (
    <div>Cannot verify email</div>
  );
}
