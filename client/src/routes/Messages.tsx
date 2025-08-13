import { useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, SendMessageIcon } from '../components/Icons';
import {
  ConversationUserInfo,
  Message,
  UserConversationsSummary,
} from '../../../shared/types';
import {
  getConversationBetweenTwoUsers,
  getConversationUserInfo,
  getUserConversationsSummary,
  sendMessage,
} from '../../Api';
import { BACKEND_STATIC_FOLDER } from '../components/ImagesCarousel';
import { UserContext } from '../context/UserContext';
import { SocketContext } from '../context/SocketContext';

export default function Messages() {
  const { user } = useContext(UserContext);
  const { targetUserId } = useParams<{ targetUserId: string }>();
  const [selectedConversationIndex, setSelectedConversationIndex] =
    useState<number>(0);
  const [usersConversationsSummary, setUsersConversationsSummary] = useState<
    UserConversationsSummary[]
  >([]);
  const [targetUserInfo, setTargetUserInfo] =
    useState<ConversationUserInfo | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && token) {
      getUserConversationsSummary({ userId: user.id, token }).then(
        (conversationsSummary: UserConversationsSummary[]) => {
          if (conversationsSummary.length) {
            if (targetUserId) {
              const targetUserIdInConversationsIndex =
                conversationsSummary.findIndex(
                  (conversationSummary) =>
                    conversationSummary.id === Number(targetUserId),
                );
              if (targetUserIdInConversationsIndex !== -1) {
                setSelectedConversationIndex(targetUserIdInConversationsIndex);
                getConversationBetweenTwoUsers({
                  actorUserId: user.id,
                  targetUserId: Number(targetUserId),
                  token,
                }).then((conversation: Message[]) =>
                  setCurrentConversation(conversation),
                );
                setUsersConversationsSummary(conversationsSummary);
              } else {
                getConversationUserInfo({
                  token,
                  targetUserId: Number(targetUserId),
                }).then((userInfo: ConversationUserInfo) => {
                  setUsersConversationsSummary([
                    {
                      id: userInfo.id,
                      imageUrl: userInfo.imageUrl,
                      username: userInfo.username,
                      isOnline: userInfo.isOnline,
                    },
                    ...conversationsSummary,
                  ]);
                });
              }
            } else {
              setUsersConversationsSummary(conversationsSummary);
              getConversationBetweenTwoUsers({
                actorUserId: user.id,
                targetUserId: conversationsSummary[0].id,
                token,
              }).then((conversation: Message[]) =>
                setCurrentConversation(conversation),
              );
            }
          } else {
            if (targetUserId) {
              getConversationUserInfo({
                token,
                targetUserId: Number(targetUserId),
              }).then((userInfo: ConversationUserInfo) => {
                setUsersConversationsSummary([
                  {
                    id: userInfo.id,
                    imageUrl: userInfo.imageUrl,
                    username: userInfo.username,
                    lastMessage: '',
                    isOnline: userInfo.isOnline,
                  },
                  ...conversationsSummary,
                ]);
              });
            }
          }
        },
      );
    }
  }, [user]);
  return (
    <>
      <Helmet>
        <title>Matcha - Messages</title>
      </Helmet>
      {usersConversationsSummary.length ? (
        <>
          <ChatDesktop
            usersConversationsSummary={usersConversationsSummary}
            currentConversation={currentConversation}
            setCurrentConversation={setCurrentConversation}
            selectedConversationIndex={selectedConversationIndex}
          />
          {/* <ChatMobile targetUserInfo={targetUserInfo} /> */}
        </>
      ) : null}
    </>
  );
}

function ChatDesktop({
  currentConversation,
  setCurrentConversation,
  usersConversationsSummary,
  selectedConversationIndex,
}: {
  currentConversation: Message[];
  setCurrentConversation: React.Dispatch<React.SetStateAction<Message[]>>;
  usersConversationsSummary: UserConversationsSummary[];
  selectedConversationIndex: number;
}) {
  const selectedUserConversation =
    usersConversationsSummary[selectedConversationIndex];
  return (
    <>
      <div className="absolute top-0 left-31 hidden lg:flex">
        <div className="border-grayDark-100 h-screen overflow-auto border-r px-4 py-5">
          {usersConversationsSummary.map(
            (userConversationSummary: UserConversationsSummary, index) => (
              <UserMessageCardDesktop
                key={userConversationSummary.id}
                targetUserInfo={userConversationSummary}
                selectedConversationIndex={selectedConversationIndex}
                currentIndex={index}
              />
            ),
          )}
        </div>
        <div className="flex flex-col items-start pt-5 pl-4">
          <Link
            to={`/userProfile/${selectedUserConversation.id}}`}
            className="flex items-center gap-2"
          >
            <img
              src={`${BACKEND_STATIC_FOLDER}${selectedUserConversation.imageUrl}`}
              alt="user"
              className="size-13 shrink-0 rounded-full object-cover"
            />
            <div>
              <span className="text-secondary font-bold">
                {selectedUserConversation.username}
              </span>
              <div className="flex items-center gap-1">
                {selectedUserConversation.isOnline ? (
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
      <ChatBoxDesktop
        targetUserId={usersConversationsSummary[selectedConversationIndex].id}
        currentConversation={currentConversation}
        setCurrentConversation={setCurrentConversation}
      />
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
  selectedConversationIndex,
  currentIndex,
}: {
  targetUserInfo: UserConversationsSummary;
  selectedConversationIndex: number;
  currentIndex: number;
}) {
  return (
    <button
      type="button"
      className={`border-grayDark-100 flex cursor-pointer items-center gap-2 border-b p-4 text-left first:rounded-t-lg last:rounded-b-lg last:border-none hover:bg-gray-50 ${selectedConversationIndex === currentIndex ? 'bg-gray-50' : ''}`}
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
        {targetUserInfo.lastMessage ? (
          <div className="text-grayDark w-full overflow-hidden text-xs overflow-ellipsis whitespace-nowrap">
            {targetUserInfo.lastMessage}
          </div>
        ) : null}
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

function ChatBoxDesktop({
  targetUserId,
  currentConversation,
  setCurrentConversation,
}: {
  targetUserId: number;
  currentConversation: Message[];
  setCurrentConversation: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const conversationRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>('');
  function handleClickSendMessage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (message.length) {
      const token = localStorage.getItem('token');
      if (user && token)
        sendMessage({
          targetUserId,
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

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [currentConversation]);
  function handleChangeMessage(event: React.ChangeEvent<HTMLInputElement>) {
    const messageValue = event.target.value;
    setMessage(messageValue);
  }
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (receivedMessage: Message) => {
        setCurrentConversation((conversation: Message[]) => [
          ...conversation,
          receivedMessage,
        ]);
      });
    }
  }, [socket]);
  return (
    <div className="z-[2] ml-107 hidden flex-1 flex-col overflow-hidden pb-5 pl-4 lg:flex xl:ml-115 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
      <div
        ref={conversationRef}
        className="mt-5 flex-1 space-y-2 overflow-auto"
      >
        {currentConversation.map(
          (conversationMessage: Message, index: number) => {
            if (conversationMessage.userId === user?.id)
              return (
                <ActorBoxMessage key={index} message={conversationMessage} />
              );
            return (
              <TargetBoxMessage key={index} message={conversationMessage} />
            );
          },
        )}
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
