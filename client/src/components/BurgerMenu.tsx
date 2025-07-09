import React, { useContext, useState } from 'react';
import { BurgerIcon, CloseIcon, UserIcon } from './Icons';
import FameRate from './FameRate';
import { HeaderNavigationItem } from './Headers/Header';
import { useNavigate } from 'react-router-dom';
import { handleClickLogout } from './DropdownHeaderItem';
import { BACKEND_STATIC_FOLDER } from './ImagesCarousel';
import { UserContext } from '../context/UserContext';

export default function HeaderBurger({
  headerNavigationItems,
}: {
  headerNavigationItems: HeaderNavigationItem[];
}) {
  const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  function handleClickOpenMobileNav() {
    setShowMobileNav(true);
  }
  function handleClickCloseMobileNav() {
    setShowMobileNav(false);
  }
  return (
    <div>
      <button
        type="button"
        className="border-grayDark-100 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
        onClick={handleClickOpenMobileNav}
      >
        <BurgerIcon className="fill-secondary h-6 w-6" />
      </button>
      {showMobileNav ? (
        <div className="fixed inset-0 z-20 bg-white py-5">
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
                {user?.age ? (
                  <div className="border-primary mr-1 h-8 w-8 overflow-hidden rounded-full border-2">
                    <img
                      src={`${BACKEND_STATIC_FOLDER}${user.imagesUrls?.[0]}`}
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <UserIcon className="fill-primary h-5 w-5" />
                )}

                <span className="text-secondary text-sm">Username</span>
              </div>
              {user?.age && (
                <>
                  <span className="text-gray-300">|</span>
                  <FameRate className="border-grayDark" />
                </>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-2">
              {headerNavigationItems.map(
                (headerNavigationItem: HeaderNavigationItem) => {
                  return (
                    <button
                      key={headerNavigationItem.name}
                      type="button"
                      className="text-secondary flex cursor-pointer items-center gap-2 py-3 pl-5 text-left text-sm hover:bg-gray-50"
                      onClick={() => {
                        if (
                          headerNavigationItem.name.toLocaleLowerCase() ===
                          'logout'
                        )
                          handleClickLogout({ navigate, setUser });

                        setShowMobileNav(false);
                        navigate(headerNavigationItem.route);
                      }}
                    >
                      {React.cloneElement(headerNavigationItem.icon, {
                        className: 'fill-secondary h-5 w-5',
                      })}
                      <span>{headerNavigationItem.name}</span>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
