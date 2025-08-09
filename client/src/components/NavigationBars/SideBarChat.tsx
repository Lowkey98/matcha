import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { NavigationItem } from '../Navigation';

export default function SidebarChat({
  navigationItems,
  className,
}: {
  navigationItems: NavigationItem[];
  className?: string;
}) {
  return (
    <div
      className={`border-grayDark-100 fixed top-0 flex h-screen flex-col items-center border-r px-4 pt-5 2xl:border-l ${className}`}
    >
      <Link to={'/'}>
        <img src="/favicon.svg" alt="logo" className="w-12" />
      </Link>
      <div className="flex grow flex-col justify-center gap-11">
        {navigationItems.map((navigationItem: NavigationItem) => (
          <NavLink to={navigationItem.route} key={navigationItem.name}>
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center gap-1 text-sm ${isActive ? 'fill-primary text-primary' : 'fill-grayDark text-grayDark'}`}
              >
                {React.cloneElement(navigationItem.icon, {
                  className: 'w-7 h-7',
                })}
                {navigationItem.name}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
