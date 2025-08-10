import { useContext, useEffect } from 'react';
import { StarIcon } from './Icons';
import { UserContext } from '../context/UserContext';
import { calculateFameRate } from '../../Api';

export default function FameRate({ className }: { className?: string }) {
  // use effect calls calculateFameRate which calculates the fame rate based how many times user viewed versus how many times most viewed user was viewed
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (!user) return;
    calculateFameRate({
      userId: user.id,
      token: localStorage.getItem('token') || '',
    });
  }, [user]);
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="lg:border-grayDark-100 flex items-center justify-center lg:h-12 lg:w-12 lg:rounded-full lg:border-2">
        <StarIcon className="fill-primary h-7 w-7 lg:h-6 lg:w-6" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-gray-300">Fame rate</span>
        <span className="text-secondary text-lg font-bold">2.5</span>
      </div>
    </div>
  );
}
