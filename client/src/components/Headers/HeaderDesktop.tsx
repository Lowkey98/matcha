import FameRate from '../FameRate';
import DropdownHeaderItem from '../DropdownHeaderItem';
import NotificationsHeaderItem from '../NotificationsHeaderItem';
import { useContext } from 'react';
import { HeaderNavigationItem } from './Header';
import { UserContext } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';

export function HeaderDesktop({
  headerNavigationItems,
  className,
}: {
  headerNavigationItems: HeaderNavigationItem[];
  className?: string;
}) {
  const { user } = useContext(UserContext);
  const locatoin = useLocation();
  return (
    <div className={`flex items-center justify-between pt-5 ${className}`}>
      {!user?.age && <img src="/logo.svg" alt="logo" className="w-42" />}
      <div className="flex flex-1 items-center justify-end gap-8">
        {user?.age && (
          <>
            {locatoin.pathname !== '/messages' &&
            !locatoin.pathname.startsWith('/messages/') ? (
              <FameRate fameRate={user.fameRate || 0} />
            ) : null}
            <NotificationsHeaderItem />
          </>
        )}
        <DropdownHeaderItem headerNavigationItems={headerNavigationItems} />
      </div>
    </div>
  );
}
