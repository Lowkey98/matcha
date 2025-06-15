import FameRate from '../FameRate';
import DropdownHeaderItem from '../DropdownHeaderItem';
import NotificationHeaderItem from '../NotificationHeaderItem';

export function HeaderDesktop({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-between pt-5 ${className}`}>
      {/* TODO handle display of logo depends on the authentication */}
      {/* <img src="/logo.svg" alt="logo" className="w-42" /> */}
      <div className="flex flex-1 items-center justify-end gap-8">
        {/* TODO handle display of fame rate and notification depends on the authentication */}
        <FameRate />
        <NotificationHeaderItem />
        <DropdownHeaderItem />
      </div>
    </div>
  );
}
