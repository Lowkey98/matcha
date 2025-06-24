import { Link, useNavigate } from 'react-router-dom';
import { ArrowDownIcon, ArrowUpIcon } from './Icons';
import React, { useState } from 'react';
import { HeaderNavigationItem } from './Headers/Header';
export default function DropdownNavItem({
  headerNavigationItems,
}: {
  headerNavigationItems: HeaderNavigationItem[];
}) {
  const navigate = useNavigate();
  const [showItems, setShowItems] = useState<boolean>(false);
  function handleClickDropdownNavItem() {
    setShowItems(!showItems);
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="border-grayDark-100 flex cursor-pointer items-center justify-between gap-6 rounded-lg border-2 bg-white px-3 py-2"
        onClick={handleClickDropdownNavItem}
      >
        <div className="flex items-center gap-1">
          {/* TODO handle display of user icon or user image depends on the authentication */}
          {/* <UserIcon className="fill-primary h-5 w-5" /> */}
          <div className="border-primary mr-1 h-8 w-8 rounded-full border-2">
            {/* <img src="" alt="user" className="object-cover" /> */}
          </div>
          <span className="text-secondary text-sm">Username</span>
        </div>
        {showItems ? (
          <ArrowUpIcon className="fill-secondary h-3.5 w-3.5" />
        ) : (
          <ArrowDownIcon className="fill-secondary h-3.5 w-3.5" />
        )}
      </button>
      {showItems ? (
        <div className="border-grayDark-100 absolute mt-2 flex w-full flex-col rounded-lg border-2 bg-white">
          {headerNavigationItems.map((headerNavigationItem) => (
            <button
              key={headerNavigationItem.name}
              type="button"
              className="text-secondary flex cursor-pointer items-center gap-2 p-3 text-left text-sm hover:bg-gray-50"
              onClick={() => {
                setShowItems(false);
                navigate(headerNavigationItem.route);
              }}
            >
              {React.cloneElement(headerNavigationItem.icon, {
                className: 'fill-secondary h-5 w-5',
              })}
              <span>{headerNavigationItem.name}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
