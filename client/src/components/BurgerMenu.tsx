import React, { useContext, useState } from 'react';
import { BurgerIcon, CloseIcon, UserIcon } from './Icons';
import FameRate from './FameRate';
import { HeaderNavigationItem } from './Headers/Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleClickLogout } from './DropdownHeaderItem';
import { BACKEND_STATIC_FOLDER } from './ImagesCarousel';
import { UserContext } from '../context/UserContext';
import { SortCard } from './ProfilesSlider';
import { SortsContext } from '../context/SortsContext';
import { Filter, Sort } from '../../../shared/types';
import { FiltersContext } from '../context/FiltersContext';
import FilterCard from './FilterCard';

export default function HeaderBurger({
  headerNavigationItems,
}: {
  headerNavigationItems: HeaderNavigationItem[];
}) {
  const { sorts } = useContext(SortsContext);
  const { filters } = useContext(FiltersContext);
  const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();

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
        <div className="fixed inset-0 z-20 overflow-auto bg-white pt-5 pb-2">
          <div className="flex justify-end pr-5">
            <button
              type="button"
              className="border-grayDark-100 flex cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
              onClick={handleClickCloseMobileNav}
            >
              <CloseIcon className="fill-secondary size-3.5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1 pl-5">
                {user?.age ? (
                  <div className="border-primary mr-1 size-10 overflow-hidden rounded-full border-2">
                    <img
                      src={`${BACKEND_STATIC_FOLDER}${user.imagesUrls?.[0]}`}
                      alt="user"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <UserIcon className="fill-primary h-5 w-5" />
                )}

                <span className="text-secondary text-sm">{user?.username}</span>
              </div>
              {user?.age && (
                <>
                  <span className="text-gray-300">|</span>
                  <FameRate className="border-grayDark" />
                </>
              )}
            </div>
            {user?.age && location.pathname === '/explore' ? (
              <div className="mt-5">
                <div className="text-secondary">
                  <span className="inline-block px-5 font-medium">Sort by</span>
                  <div className="mt-5 flex flex-col gap-6 px-5 pb-5 text-sm">
                    {sorts.map((sort: Sort, index: number) => (
                      <SortCard key={index} sortInfo={sort} />
                    ))}
                  </div>
                </div>
                <div className="bg-grayDark-100 h-0.5" />
                <div className="text-secondary mt-5">
                  <span className="inline-block px-5 font-medium">
                    Filter by
                  </span>
                  <div className="mt-5 flex flex-col gap-6 px-5 pb-5 text-sm">
                    {filters.map((filter: Filter, index: number) => (
                      <FilterCard key={index} filterInfo={filter} />
                    ))}
                  </div>
                </div>
                <div className="bg-grayDark-100 h-0.5" />
              </div>
            ) : null}
            <div className="mt-2 flex flex-col gap-2">
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
