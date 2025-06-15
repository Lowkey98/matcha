import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { NavigationItem } from '../Navigation';

export default function SidebarMobile({
  navigationItems,
  className,
}: {
  navigationItems: NavigationItem[];
  className?: string;
}) {
  return (
    <div
      className={`border-grayDark-100 fixed bottom-0 left-0 flex w-full items-center justify-between gap-2 border-t bg-white px-5 py-4 ${className}`}
    >
      {navigationItems.map((navigationItem: NavigationItem) => (
        <NavLink to={navigationItem.route} key={navigationItem.name}>
          {({ isActive }) =>
            React.cloneElement(navigationItem.icon, {
              className: `w-8 h-8 ${isActive ? 'fill-primary' : 'fill-grayDark'}`,
            })
          }
        </NavLink>
      ))}
    </div>
  );
}
