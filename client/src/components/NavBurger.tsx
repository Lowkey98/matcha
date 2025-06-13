import { useState } from 'react';
import {
  BurgerIcon,
  CloseIcon,
  EditIcon,
  LogoutIcon,
  SettingsIcon,
  UserIcon,
} from './Icons';
import FameRate from './FameRate';

export default function NavBurger({ className }: { className?: string }) {
  const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
  function handleClickOpenMobileNav() {
    setShowMobileNav(true);
  }
  function handleClickCloseMobileNav() {
    setShowMobileNav(false);
  }
  return (
    <div className={className}>
      <button
        type="button"
        className="border-grayDark-100 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
        onClick={handleClickOpenMobileNav}
      >
        <BurgerIcon className="fill-secondary h-6 w-6" />
      </button>
      {showMobileNav ? (
        <div className="fixed inset-0 z-1 bg-white py-5">
          <div className="flex justify-end pr-5">
            <button
              type="button"
              className="border-grayDark-100 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
              onClick={handleClickCloseMobileNav}
            >
              <CloseIcon className="fill-secondary h-4 w-4" />
            </button>
          </div>
          <div className="mt-12">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1 pl-5">
                {/* TODO handle display of user icon or user image depends on the authentication */}
                {/* <UserIcon className="fill-primary h-5 w-5" /> */}
                <div className="border-primary mr-1 h-8 w-8 rounded-full border-2">
                  {/* <img src="" alt="user" className="object-cover" /> */}
                </div>
                <span className="text-secondary text-sm">Username</span>
              </div>
              {/* TODO handle display of fame rate depends on the authentication */}
              <span className="text-gray-300">|</span>
              <FameRate className="border-grayDark" />
            </div>
            <div className="mt-10 flex flex-col gap-2">
              <button
                type="button"
                className="text-secondary flex cursor-pointer items-center gap-2 py-3 pl-5 text-left text-sm hover:bg-gray-50"
              >
                <SettingsIcon className="fill-secondary h-5 w-5" />
                <span>Settings</span>
              </button>
              {/* TODO handle display of edit profile depends on the authentication */}
              <button
                type="button"
                className="text-secondary flex cursor-pointer items-center gap-2 py-3 pl-5 text-left text-sm hover:bg-gray-50"
              >
                <EditIcon className="fill-secondary h-5 w-5" />
                <span>Edit profile</span>
              </button>
              <button
                type="button"
                className="text-secondary flex cursor-pointer items-center gap-2 py-3 pl-5 text-left text-sm hover:bg-gray-50"
              >
                <LogoutIcon className="fill-secondary h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
