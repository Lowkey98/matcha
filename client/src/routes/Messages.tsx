import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, SendMessageIcon } from '../components/Icons';
import { ConversationUserInfo, Message } from '../../../shared/types';
import { getConversationUserInfo, sendMessage } from '../../Api';
import { BACKEND_STATIC_FOLDER } from '../components/ImagesCarousel';
import { UserContext } from '../context/UserContext';
import { SocketContext } from '../context/SocketContext';

export default function Messages() {
  const { targetUserId } = useParams<{ targetUserId: string }>();
  const [selectedConversationIndex, setSelectedConversationIndex] =
    useState<number>(0);
  const [targetUserInfo, setTargetUserInfo] =
    useState<ConversationUserInfo | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && targetUserId) {
      getConversationUserInfo({
        token,
        targetUserId: Number(targetUserId),
      }).then((userInfo: ConversationUserInfo) => {
        setTargetUserInfo(userInfo);
      });
    }
  }, []);
  return (
    <>
      <Helmet>
        <title>Matcha - Messages</title>
      </Helmet>
      {targetUserInfo ? (
        <>
          <ChatDesktop targetUserInfo={targetUserInfo} />
          <ChatMobile targetUserInfo={targetUserInfo} />
        </>
      ) : null}
    </>
  );
}

function ChatDesktop({
  targetUserInfo,
}: {
  targetUserInfo: ConversationUserInfo;
}) {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const [message, setMessage] = useState<string>('');
  function handleClickSendMessage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (message.length) {
      const token = localStorage.getItem('token');
      if (user && token)
        sendMessage({
          targetUserId: targetUserInfo.id,
          actorUserId: user.id,
          message: {
            userId: user.id,
            description: message,
            time: getCurrentTime(),
          },
          token,
        }).then(() => {
          setMessage('');
        });
    }
  }
  function handleChangeMessage(event: React.ChangeEvent<HTMLInputElement>) {
    const messageValue = event.target.value;
    setMessage(messageValue);
  }

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (receivedMessage: Message) => {
        setLatestMessage(receivedMessage);
      });
    }
  }, [socket]);

  return (
    <>
      <div className="absolute top-0 left-31 hidden lg:flex">
        <div className="border-grayDark-100 h-screen overflow-auto border-r px-4 py-5">
          <UserMessageCardDesktop targetUserInfo={targetUserInfo} />
        </div>
        <div className="flex flex-col items-start pt-5 pl-4">
          <Link
            to={`/userProfile/${targetUserInfo.id}`}
            className="flex items-center gap-2"
          >
            <img
              src={`${BACKEND_STATIC_FOLDER}${targetUserInfo.imageUrl}`}
              alt="user"
              className="size-13 shrink-0 rounded-full object-cover"
            />
            <div>
              <span className="text-secondary font-bold">
                {targetUserInfo.username}
              </span>
              <div className="flex items-center gap-1">
                {targetUserInfo.isOnline ? (
                  <>
                    <div className="size-2 rounded-full bg-[#71D191]" />
                    <span className="text-grayDark text-sm font-light">
                      Online
                    </span>
                  </>
                ) : (
                  <>
                    <div className="bg-redLight size-2 rounded-full" />
                    <span className="text-grayDark text-sm font-light">
                      Offline
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="z-[2] ml-107 hidden flex-1 flex-col overflow-hidden pb-5 pl-4 lg:flex xl:ml-115 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
        <div className="mt-5 flex-1 space-y-2 overflow-auto">
          {currentConversation.map((conversationMessage: Message) => {
            if (conversationMessage.userId === user?.id)
              return <ActorBoxMessage message={conversationMessage} />;
            <TargetBoxMessage message={conversationMessage} />;
          })}
          {latestMessage ? (
            latestMessage.userId === user?.id ? (
              <ActorBoxMessage message={latestMessage} />
            ) : (
              <TargetBoxMessage message={latestMessage} />
            )
          ) : null}
        </div>
        <div className="pt-5">
          <form className="bg-grayLight flex items-center gap-4 rounded-lg pr-4">
            <input
              type="text"
              placeholder="Send a message"
              value={message}
              className="text-secondary w-full py-4 pl-4 text-sm font-normal outline-0 placeholder:text-sm placeholder:text-[#B1B1B1]"
              onChange={handleChangeMessage}
            />
            <button
              type="submit"
              onClick={handleClickSendMessage}
              className="cursor-pointer"
            >
              <SendMessageIcon className="fill-primary size-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function ChatMobile({
  targetUserInfo,
}: {
  targetUserInfo: ConversationUserInfo;
}) {
  const [showChatBox, setShowChatBox] = useState<boolean>(false);
  return (
    <>
      <main className="mt-8 mb-24 lg:hidden">
        <UserMessageCardMobile
          setShowChatBox={setShowChatBox}
          targetUserInfo={targetUserInfo}
        />
      </main>
      {showChatBox ? (
        <ChatBoxMobile
          setShowChatBox={setShowChatBox}
          targetUserInfo={targetUserInfo}
        />
      ) : null}
    </>
  );
}

function UserMessageCardDesktop({
  targetUserInfo,
}: {
  targetUserInfo: ConversationUserInfo;
}) {
  return (
    <button
      type="button"
      className="border-grayDark-100 flex cursor-pointer items-center gap-2 border-b bg-gray-50 p-4 text-left first:rounded-t-lg last:rounded-b-lg last:border-none hover:bg-gray-50"
    >
      <img
        src={`${BACKEND_STATIC_FOLDER}${targetUserInfo.imageUrl}`}
        alt="user"
        className="size-13 shrink-0 rounded-full object-cover"
      />
      <div className="flex w-50 flex-col xl:w-58">
        <span className="text-secondary text-sm font-semibold">
          {targetUserInfo.username}
        </span>
        {/* <div className="text-grayDark w-full overflow-hidden text-xs overflow-ellipsis whitespace-nowrap">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
          dolorum dicta odit obcaecati amet. Eius quia laudantium error deserunt
          quam repellendus recusandae dolor. Quas dolore accusantium
          voluptatibus. A, nisi animi.
        </div> */}
      </div>
    </button>
  );
}

function UserMessageCardMobile({
  setShowChatBox,
  targetUserInfo,
}: {
  setShowChatBox: React.Dispatch<React.SetStateAction<boolean>>;
  targetUserInfo: ConversationUserInfo;
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
        src={`${BACKEND_STATIC_FOLDER}${targetUserInfo.imageUrl}`}
        alt="user"
        className="size-13 shrink-0 rounded-full object-cover"
      />
      <div className="flex min-w-0 flex-col">
        <span className="text-secondary text-sm font-semibold">
          {targetUserInfo.username}
        </span>
        {/* <div className="text-grayDark overflow-hidden text-xs overflow-ellipsis whitespace-nowrap">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae
          dolorum dicta odit obcaecati amet. Eius quia laudantium error deserunt
          quam repellendus recusandae dolor. Quas dolore accusantium
          voluptatibus. A, nisi animi.
        </div> */}
      </div>
    </button>
  );
}

function ChatBoxMobile({
  setShowChatBox,
  targetUserInfo,
}: {
  setShowChatBox: React.Dispatch<React.SetStateAction<boolean>>;
  targetUserInfo: ConversationUserInfo;
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
        <Link
          to={`/userProfile/${targetUserInfo.id}`}
          className="flex items-center gap-2 text-left"
        >
          <img
            src={`${BACKEND_STATIC_FOLDER}${targetUserInfo.imageUrl}`}
            alt="user"
            className="size-13 shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-secondary text-sm font-semibold">
              {targetUserInfo.username}
            </span>
            <div className="flex items-center gap-1">
              {targetUserInfo.isOnline ? (
                <>
                  <div className="size-2 rounded-full bg-[#71D191]"></div>
                  <span className="text-grayDark text-sm font-light">
                    Online
                  </span>
                </>
              ) : (
                <>
                  <div className="bg-redLight size-2 rounded-full"></div>
                  <span className="text-grayDark text-sm font-light">
                    Offline
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden pb-5">
        <div className="mt-5 flex-1 space-y-2 overflow-auto"></div>
        <div className="pt-5">
          <form className="bg-grayLight flex items-center gap-4 rounded-lg pr-4">
            <input
              type="text"
              placeholder="Send a message"
              className="text-secondary w-full py-4 pl-4 text-sm font-normal outline-0 placeholder:text-sm placeholder:text-[#B1B1B1]"
            />
            <button type="button" className="cursor-pointer">
              <SendMessageIcon className="fill-primary size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TargetBoxMessage({ message }: { message: Message }) {
  return (
    <div className="flex w-fit max-w-120 flex-col items-start text-sm">
      <div className="bg-primary rounded-tr-2xl rounded-b-2xl p-4 break-all text-white">
        {message.description}
      </div>
      <div className="mt-1 flex w-full justify-end">
        <span className="text-grayDark font-light">{message.time}</span>
      </div>
    </div>
  );
}
function ActorBoxMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end">
      <div className="flex w-fit max-w-120 flex-col items-start text-sm">
        <div className="text-secondary border-grayDark-100 rounded-tl-2xl rounded-b-2xl border-2 bg-white p-4 break-all">
          {message.description}
        </div>
        <div className="mt-1 flex w-full justify-end">
          <span className="text-grayDark font-light">{message.time}</span>
        </div>
      </div>
    </div>
  );
}

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
