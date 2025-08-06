import { Link, useNavigate } from 'react-router-dom';
import { ArrowDownIcon, ArrowUpIcon, UserIcon } from './Icons';
import React, { useContext, useState } from 'react';
import { HeaderNavigationItem } from './Headers/Header';
import { BACKEND_STATIC_FOLDER } from './ImagesCarousel';
import { UserContext } from '../context/UserContext';
import { SocketContext } from '../context/SocketContext';
export default function DropdownNavItem({
  headerNavigationItems,
}: {
  headerNavigationItems: HeaderNavigationItem[];
}) {
  const { user, setUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const [showItems, setShowItems] = useState<boolean>(false);
  const navigate = useNavigate();
  function handleClickDropdownNavItem() {
    setShowItems(!showItems);
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="border-grayDark-100 flex cursor-pointer items-center justify-between gap-3 rounded-lg border-2 bg-white px-3 py-1.5 text-left"
        onClick={handleClickDropdownNavItem}
      >
        <div className="flex items-center gap-1">
          {!user?.age ? (
            <UserIcon className="fill-primary h-5 w-5" />
          ) : (
            <div className="border-primary mr-1 size-9 overflow-hidden rounded-full border-2">
              <img
                src={`${BACKEND_STATIC_FOLDER}${user.imagesUrls?.[0]}`}
                alt="user"
                className="object-cover"
              />
            </div>
          )}
          <div className="text-secondary w-22 overflow-hidden text-sm overflow-ellipsis">
            {user?.username}
          </div>
        </div>
        {showItems ? (
          <ArrowUpIcon className="fill-secondary h-3.5 w-3.5" />
        ) : (
          <ArrowDownIcon className="fill-secondary h-3.5 w-3.5" />
        )}
      </button>
      {showItems ? (
        <div className="border-grayDark-100 absolute z-10 mt-2 flex w-full flex-col rounded-lg border-2 bg-white">
          {headerNavigationItems.map((headerNavigationItem) => (
            <button
              key={headerNavigationItem.name}
              type="button"
              className="text-secondary flex cursor-pointer items-center gap-2 p-3 text-left text-sm hover:bg-gray-50"
              onClick={() => {
                if (
                  headerNavigationItem.name.toLocaleLowerCase() === 'logout'
                ) {
                  socket?.disconnect();
                  handleClickLogout({ navigate, setUser });
                }
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

export function handleClickLogout({
  navigate,
  setUser,
}: {
  navigate: (path: string) => void;
  setUser: React.Dispatch<any>;
}) {
  localStorage.removeItem('token');
  setUser(null);
  navigate('/login');
}
