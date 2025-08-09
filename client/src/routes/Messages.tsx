import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '../components/Icons';

export default function Messages() {
  return (
    <>
      <Helmet>
        <title>Matcha - Messages</title>
      </Helmet>
      <ChatDesktop />
      <ChatMobile />
    </>
  );
}

function ChatDesktop() {
  return (
    <div className="absolute top-0 left-31 hidden lg:flex">
      <div className="border-grayDark-100 h-screen overflow-auto border-r px-4 py-5">
        <UserMessageCardDesktop />
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
  );
}

function ChatMobile() {
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  return (
    <>
      <main className="mt-8 mb-24 lg:hidden">
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
        <UserMessageCardMobile setShowChatBox={setShowChatBox} />
      </main>
      {showChatBox ? <ChatBoxMobile setShowChatBox={setShowChatBox} /> : null}
    </>
  );
}

function UserMessageCardDesktop() {
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

function UserMessageCardMobile({
  setShowChatBox,
}: {
  setShowChatBox: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleClickMessageCard() {
    setShowChatBox(true);
  }
  return (
    <button
      type="button"
      className="border-grayDark-100 flex w-full cursor-pointer items-center gap-2 border-b py-4 text-left last:border-none"
      onClick={handleClickMessageCard}
    >
      <img
        src="/profile-slides-images/slide-1.jpg"
        alt="user"
        className="size-13 shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-col">
        <span className="text-secondary text-sm font-semibold">Username</span>
        <div className="text-grayDark overflow-hidden text-xs overflow-ellipsis whitespace-nowrap">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
          dolorum dicta odit obcaecati amet. Eius quia laudantium error deserunt
          quam repellendus recusandae dolor. Quas dolore accusantium
          voluptatibus. A, nisi animi.
        </div>
      </div>
    </button>
  );
}

function ChatBoxMobile({
  setShowChatBox,
}: {
  setShowChatBox: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function handleClickBackButton() {
    setShowChatBox(false);
  }
  return (
    <div className="fixed inset-0 z-10 bg-white px-5 pt-5 lg:hidden [:has(&)]:overflow-hidden [:has(&)]:lg:overflow-visible">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="border-grayDark-100 shrink-0 cursor-pointer rounded-full border-2 bg-white p-2"
          onClick={handleClickBackButton}
        >
          <ArrowLeftIcon className="fill-secondary size-4" />
        </button>
        <Link to={'/profile'} className="flex items-center gap-2 text-left">
          <img
            src="/profile-slides-images/slide-1.jpg"
            alt="user"
            className="size-13 shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-secondary text-sm font-semibold">
              Username
            </span>
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-[#71D191]"></div>
              <span className="text-grayDark text-sm font-light">Online</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
