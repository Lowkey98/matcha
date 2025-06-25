import FameRate from '../FameRate';
import DropdownHeaderItem from '../DropdownHeaderItem';
import NotificationsHeaderItem from '../NotificationsHeaderItem';
import { UserContext } from '../../Root';
import { useContext } from 'react';
import { HeaderNavigationItem } from './Header';

export function HeaderDesktop({
  headerNavigationItems,
  className,
}: {
  headerNavigationItems: HeaderNavigationItem[];
  className?: string;
}) {
  const { user } = useContext(UserContext);
  return (
    <div className={`flex items-center justify-between pt-5 ${className}`}>
      {user && <img src="/logo.svg" alt="logo" className="w-42" />}
      <div className="flex flex-1 items-center justify-end gap-8">
        {user && <FameRate />}
        <NotificationsHeaderItem />
        <DropdownHeaderItem headerNavigationItems={headerNavigationItems} />
      </div>
    </div>
  );
}
