import DropdownNavItem from './DropdownNavItem';
import NavBurger from './NavBurger';

export function Navbar() {
  return (
    <div className="flex items-center justify-between p-5">
      <img src="/logo.svg" alt="logo" className="w-42" />
      <NavBurger className="lg:hidden" />
      <DropdownNavItem className="hidden lg:block" />
    </div>
  );
}
