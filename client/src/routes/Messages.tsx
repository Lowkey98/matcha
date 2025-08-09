import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function Messages() {
  return (
    <>
      <Helmet>
        <title>Matcha - Messages</title>
      </Helmet>
      <div className="absolute top-0 left-31 h-screen overflow-auto px-4 py-5">
        <UserMessageCard />
      </div>
      <div className="absolute top-0 left-120 pt-5">
        <Link to={'/profile'} className="cursor-pointer">
          <span className="text-secondary font-bold">Username</span>
          <div className="flex items-center gap-1">
            <div className="size-2 rounded-full bg-[#71D191]"></div>
            <span className="text-grayDark text-sm font-light">Online</span>
          </div>
        </Link>
      </div>
    </>
  );
}

function UserMessageCard() {
  return (
    <button
      type="button"
      className="border-grayDark-100 last:rounded- flex cursor-pointer items-center gap-2 border-b bg-gray-50 p-4 text-left first:rounded-t-lg last:rounded-b-lg last:border-none hover:bg-gray-50"
    >
      <img
        src="/profile-slides-images/slide-1.jpg"
        alt="user"
        className="size-13 shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-secondary text-sm font-semibold">Username</span>
        <div className="text-grayDark w-58 overflow-hidden text-xs overflow-ellipsis whitespace-nowrap">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
          dolorum dicta odit obcaecati amet. Eius quia laudantium error deserunt
          quam repellendus recusandae dolor. Quas dolore accusantium
          voluptatibus. A, nisi animi.
        </div>
      </div>
    </button>
  );
}
