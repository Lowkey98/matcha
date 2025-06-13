import DropdownNavItem from './DropdownNavItem';
import FameRate from './FameRate';
import NavBurger from './NavBurger';
import NotificationNavItem from './NotificationNavItem';

export function Navbar() {
  return (
    <div className="flex items-center justify-between pt-5">
      <img src="/logo.svg" alt="logo" className="w-42" />
      <NavBurger className="lg:hidden" />
      <div className="hidden items-center gap-8 lg:flex">
        {/* TODO handle display of fame rate and notification depends on the authentication */}
        <FameRate />
        <NotificationNavItem />
        <DropdownNavItem />
      </div>
    </div>
  );
}
