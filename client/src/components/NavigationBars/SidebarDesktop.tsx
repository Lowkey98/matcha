import React from 'react';
import { NavLink } from 'react-router-dom';
import type { NavigationItem } from '../Navigation';

export default function SidebarDesktop({
  navigationItems,
  className,
}: {
  navigationItems: NavigationItem[];
  className?: string;
}) {
  return (
    <div
      className={`border-grayDark-100 fixed top-0 flex h-screen flex-col border-r pt-5 [:has(&)]:lg:!pl-0 ${className}`}
    >
      <img src="/logo.svg" alt="logo" className="mx-5 w-42" />
      <div className="flex grow flex-col justify-center gap-11">
        {navigationItems.map((navigationItem: NavigationItem) => (
          <NavLink to={navigationItem.route} key={navigationItem.name}>
            {({ isActive }) => (
              <div
                className={`text-secondary flex items-center gap-3 border-l-4 px-5 py-3 ${isActive ? 'border-primary bg-gray-50' : 'border-transparent bg-white'}`}
              >
                {React.cloneElement(navigationItem.icon, {
                  className: 'w-7 h-7 fill-primary',
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
