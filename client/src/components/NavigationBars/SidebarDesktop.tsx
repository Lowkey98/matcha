import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import type { NavigationItem } from '../Navigation';

export default function SidebarDesktop({
  navigationItems,
  className,
}: {
  navigationItems: NavigationItem[];
  className?: string;
}) {
  const location = useLocation();
  return (
    <div
      className={`border-grayDark-100 fixed top-0 flex h-screen flex-col border-r pt-5 2xl:border-l ${className}`}
    >
      <Link to={'/'}>
        <img src="/logo.svg" alt="logo" className="mx-5 w-42" />
      </Link>
      <div className="flex grow flex-col justify-center gap-11">
        {navigationItems.map((navigationItem: NavigationItem) => {
          const customActive =
            navigationItem.route === '/explore' &&
            (location.pathname === '/' || location.pathname === '/explore');
          return (
            <NavLink to={navigationItem.route} key={navigationItem.name}>
              {({ isActive }) => (
                <div
                  className={`text-secondary flex items-center gap-3 border-l-4 px-5 py-3 ${isActive || customActive ? 'border-primary bg-gray-50' : 'border-transparent bg-white'}`}
                >
                  {React.cloneElement(navigationItem.icon, {
                    className: 'w-7 h-7 fill-primary',
                  })}
                  {navigationItem.name}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
