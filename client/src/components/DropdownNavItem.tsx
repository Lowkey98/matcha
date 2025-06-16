import { Link } from 'react-router-dom';
import {
  ArrowDownIcon,
  UserIcon,
  SettingsIcon,
  EditIcon,
  LogoutIcon,
  ArrowUpIcon,
} from './Icons';
import { useState } from 'react';
export default function DropdownNavItem({ className }: { className?: string }) {
  const [showItems, setShowItems] = useState<boolean>(false);
  function handleClickDropdownNavItem() {
    setShowItems(!showItems);
  }
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="border-grayDark-100 flex cursor-pointer items-center justify-between gap-6 rounded-lg border-2 bg-white p-3"
        onClick={handleClickDropdownNavItem}
      >
        <div className="flex items-center gap-1">
          <UserIcon className="fill-primary h-5 w-5" />
          <span className="text-secondary text-sm">Username</span>
        </div>
        {showItems ? (
          <ArrowUpIcon className="fill-secondary h-3.5 w-3.5" />
        ) : (
          <ArrowDownIcon className="fill-secondary h-3.5 w-3.5" />
        )}
      </button>
      {showItems ? (
        <div className="border-grayDark-100 absolute mt-2 flex w-full flex-col rounded-lg border-2">
          <Link
            to="/settings"
            className="text-secondary flex cursor-pointer items-center gap-2 p-3 text-left text-sm hover:bg-gray-50"
          >
            <SettingsIcon className="fill-secondary h-5 w-5" />
            <span>Settings</span>
          </Link>
          <button
            type="button"
            className="text-secondary flex cursor-pointer items-center gap-2 p-3 text-left text-sm hover:bg-gray-50"
          >
            <EditIcon className="fill-secondary h-5 w-5" />
            <span>Edit profile</span>
          </button>
          <button
            type="button"
            className="text-secondary flex cursor-pointer items-center gap-2 p-3 text-left text-sm hover:bg-gray-50"
          >
            <LogoutIcon className="fill-secondary h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
