import { useState } from 'react';
import { NotificationsIcon } from './Icons';

export default function NotificationsHeaderItem() {
  const [showItems, setShowItems] = useState<boolean>(false);
  function handleClickNotificationsHeaderItem() {
    setShowItems(!showItems);
  }
  return (
    <div className="relative">
      <button
        type="button"
        className="border-grayDark-100 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 p-2.5"
        onClick={handleClickNotificationsHeaderItem}
      >
        <NotificationsIcon className="fill-secondary h-6 w-6" />
      </button>
      {showItems ? (
        <div className="border-grayDark-100 text-secondary absolute top-15 right-0 flex w-72 flex-col rounded-lg border-2 bg-white p-3">
          <span>Text notification.</span>
        </div>
      ) : null}
    </div>
  );
}
