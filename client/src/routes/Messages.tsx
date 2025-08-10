import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SendMessageIcon } from '../components/Icons';

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
    <>
      <div className="absolute top-0 left-31 hidden lg:flex">
        <div className="border-grayDark-100 h-screen overflow-auto border-r px-4 py-5">
          <UserMessageCardDesktop />
        </div>
        <div className="flex flex-col items-start pt-5 pl-4">
          <Link to={'/profile'} className="flex items-center gap-2">
            <img
              src="/profile-slides-images/slide-1.jpg"
              alt="user"
              className="size-13 shrink-0 rounded-full object-cover"
            />
            <div>
              <span className="text-secondary font-bold">Username</span>
              <div className="flex items-center gap-1">
                <div className="size-2 rounded-full bg-[#71D191]" />
                <span className="text-grayDark text-sm font-light">Online</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="ml-107 hidden flex-1 flex-col overflow-hidden pb-5 pl-4 lg:flex xl:ml-115 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
        <div className="mt-5 flex-1 space-y-2 overflow-auto">
          <TargetBoxMessage />
          <ActorBoxMessage />
        </div>
        <div className="pt-5">
          <form className="bg-grayLight flex items-center gap-4 rounded-lg px-4">
            <input
              type="text"
              placeholder="Send a message"
              className="text-secondary w-full py-4 text-sm font-normal outline-0 placeholder:text-sm placeholder:text-[#B1B1B1]"
            />
            <button type="button">
              <SendMessageIcon className="fill-primary size-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function ChatMobile() {
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  return (
    <>
      <main className="mt-8 mb-24 lg:hidden">
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
        <div className="text-grayDark w-50 overflow-hidden text-xs overflow-ellipsis whitespace-nowrap xl:w-58">
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
    <div className="fixed inset-0 z-10 flex flex-col bg-white px-5 pt-5 lg:hidden [:has(&)]:overflow-hidden [:has(&)]:lg:overflow-visible">
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
      <div className="flex flex-1 flex-col overflow-hidden pb-5">
        <div className="mt-5 flex-1 space-y-2 overflow-auto">
          <TargetBoxMessage />
          <ActorBoxMessage />
          <TargetBoxMessage />
          <ActorBoxMessage />
          <TargetBoxMessage />
          <ActorBoxMessage />
          <TargetBoxMessage />
          <ActorBoxMessage />
          <TargetBoxMessage />
          <ActorBoxMessage />
        </div>
        <div className="pt-5">
          <form className="bg-grayLight flex items-center gap-4 rounded-lg px-4">
            <input
              type="text"
              placeholder="Send a message"
              className="text-secondary w-full py-4 text-sm font-normal outline-0 placeholder:text-sm placeholder:text-[#B1B1B1]"
            />
            <button type="button">
              <SendMessageIcon className="fill-primary size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TargetBoxMessage() {
  return (
    <div className="flex w-fit max-w-120 flex-col items-start text-sm">
      <div className="bg-primary rounded-tr-2xl rounded-b-2xl p-4 break-all text-white">
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry ☺️
      </div>
      <div className="mt-1 flex w-full justify-end">
        <span className="text-grayDark font-light">00:25</span>
      </div>
    </div>
  );
}
function ActorBoxMessage() {
  return (
    <div className="flex justify-end">
      <div className="flex w-fit max-w-120 flex-col items-start text-sm">
        <div className="text-secondary border-grayDark-100 rounded-tl-2xl rounded-b-2xl border-2 bg-white p-4 break-all">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry ☺️
        </div>
        <div className="mt-1 flex w-full justify-end">
          <span className="text-grayDark font-light">00:25</span>
        </div>
      </div>
    </div>
  );
}
