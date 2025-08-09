import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

export default function Messages() {
  return (
    <>
      <Helmet>
        <title>Matcha - Messages</title>
      </Helmet>
      <div className="absolute top-0 left-31 flex">
        <div className="border-grayDark-100 h-screen overflow-auto border-r px-4 py-5">
          <UserMessageCard />
        </div>
        <div className="pt-5 pl-4">
          <Link to={'/profile'} className="cursor-pointer">
            <span className="text-secondary font-bold">Username</span>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-[#71D191]"></div>
              <span className="text-grayDark text-sm font-light">Online</span>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

function UserMessageCard() {
  return (
    <button
      type="button"
      className="border-grayDark-100 flex cursor-pointer items-center gap-2 border-b bg-gray-50 p-4 text-left first:rounded-t-lg last:rounded-b-lg last:border-none hover:bg-gray-50"
    >
      <img
        src="/profile-slides-images/slide-1.jpg"
        alt="user"
        className="size-13 shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-secondary text-sm font-semibold">Username</span>
        <div className="text-grayDark w-[20vw] overflow-hidden text-xs overflow-ellipsis whitespace-nowrap xl:w-58">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
          dolorum dicta odit obcaecati amet. Eius quia laudantium error deserunt
          quam repellendus recusandae dolor. Quas dolore accusantium
          voluptatibus. A, nisi animi.
        </div>
      </div>
    </button>
  );
}
