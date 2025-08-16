import { useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ExclamationBorderIcon,
  SendMessageIcon,
} from '../components/Icons';
import {
  ConversationUserInfo,
  Message,
  UserConversationsSummary,
} from '../../../shared/types';
import {
  checkTwoUsersMatch,
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
  const { socket } = useContext(SocketContext);
  const { targetUserId } = useParams<{ targetUserId: string }>();
  const navigate = useNavigate();
  const [selectedConversationIndex, setSelectedConversationIndex] =
    useState<number>(0);
  const [usersConversationsSummary, setUsersConversationsSummary] = useState<
    UserConversationsSummary[]
  >([]);
  const [loader, setLoader] = useState<boolean>(true);
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);
  async function getConversations() {
    const token = localStorage.getItem('token');
    if (user && token) {
      if (targetUserId) {
        if (Number(targetUserId) === user.id) {
          navigate('/explore');
          return;
        }
        const isTwoUsersMatch = await checkTwoUsersMatch({
          actorUserId: user.id,
          targetUserId: Number(targetUserId),
          token,
        }).catch((error) => {
          console.error(error);
          throw error;
        });
        if (!isTwoUsersMatch) {
          navigate('/explore');
          return;
        }
      }
      getUserConversationsSummary({ userId: user.id, token }).then(
        (conversationsSummaryFromDb: UserConversationsSummary[]) => {
          if (conversationsSummaryFromDb.length) {
            const sortedConversationsSummaryFromDb =
              conversationsSummaryFromDb.sort(
                (a, b) =>
                  new Date(b.time).getTime() - new Date(a.time).getTime(),
              );
            if (targetUserId) {
              const targetUserIdInConversationsIndex =
                sortedConversationsSummaryFromDb.findIndex(
                  (sortedConversationSummaryFromDb) =>
                    sortedConversationSummaryFromDb.id === Number(targetUserId),
                );
              if (targetUserIdInConversationsIndex !== -1) {
                setSelectedConversationIndex(targetUserIdInConversationsIndex);
                getConversationBetweenTwoUsers({
                  actorUserId: user.id,
                  targetUserId: Number(targetUserId),
                  token,
                }).then((conversation: Message[]) => {
                  setCurrentConversation(conversation);
                  setUsersConversationsSummary(sortedConversationsSummaryFromDb);
                  setLoader(false);
                });
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
                      time: new Date().toISOString(),
                      lastOnline:
                        userInfo.lastOnline || new Date().toISOString(),
                    },
                    ...sortedConversationsSummaryFromDb,
                  ]);
                  setLoader(false);
                });
              }
            } else {
              setUsersConversationsSummary(sortedConversationsSummaryFromDb);
              getConversationBetweenTwoUsers({
                actorUserId: user.id,
                targetUserId: sortedConversationsSummaryFromDb[0].id,
                token,
              }).then((conversation: Message[]) => {
                setCurrentConversation(conversation);
                setLoader(false);
              });
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
                    isOnline: userInfo.isOnline,
                    time: new Date().toISOString(),
                    lastOnline: userInfo.lastOnline || new Date().toISOString(),
                  },
                ]);
                setLoader(false);
              });
            } else {
              setLoader(false);
            }
          }
        },
      );
    }
  }
  useEffect(() => {
    getConversations();
  }, [user]);

  const currentTargetUser =
    usersConversationsSummary[selectedConversationIndex];

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (receivedMessage: Message) => {
        if (
          receivedMessage.userId === currentTargetUser.id ||
          receivedMessage.userId === user?.id ||
          !usersConversationsSummary.length
        ) {
          setCurrentConversation((conversation: Message[]) => [
            ...conversation,
            receivedMessage,
          ]);
          setSelectedConversationIndex(0);
        }
        const token = localStorage.getItem('token');
        if (user && token) {
          getUserConversationsSummary({ userId: user.id, token }).then(
            (conversationsSummary) => {
              const sortedConversationsSummary = conversationsSummary.sort(
                (a, b) =>
                  new Date(b.time).getTime() - new Date(a.time).getTime(),
              );
              setUsersConversationsSummary(sortedConversationsSummary);
            },
          );
        }
      });
      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, user, currentTargetUser?.id]);
  return (
    <>
      <Helmet>
        <title>Matcha - Messages</title>
      </Helmet>
      {!loader ? (
        usersConversationsSummary.length ? (
          <>
            <ChatDesktop
              usersConversationsSummary={usersConversationsSummary}
              currentConversation={currentConversation}
              setCurrentConversation={setCurrentConversation}
              selectedConversationIndex={selectedConversationIndex}
              setSelectedConversationIndex={setSelectedConversationIndex}
            />
            <ChatMobile
              usersConversationsSummary={usersConversationsSummary}
              currentConversation={currentConversation}
              setCurrentConversation={setCurrentConversation}
              selectedConversationIndex={selectedConversationIndex}
              setSelectedConversationIndex={setSelectedConversationIndex}
            />
          </>
        ) : (
          <div className="text-secondary flex flex-1 items-center justify-center gap-1 lg:ml-26 [:has(&)]:flex [:has(&)]:h-full [:has(&)]:w-full [:has(&)]:flex-1 [:has(&)]:flex-col">
            <ExclamationBorderIcon className="fill-secondary size-6" />
            No messages yet.
          </div>
        )
      ) : null}
    </>
  );
}

function ChatDesktop({
  currentConversation,
  setCurrentConversation,
  usersConversationsSummary,
  selectedConversationIndex,
  setSelectedConversationIndex,
  currentTargetUser,
}: {
  currentConversation: Message[];
  setCurrentConversation: React.Dispatch<React.SetStateAction<Message[]>>;
  usersConversationsSummary: UserConversationsSummary[];
  selectedConversationIndex: number;
  setSelectedConversationIndex: React.Dispatch<React.SetStateAction<number>>;
  currentTargetUser: UserConversationsSummary;
}) {
  const { socket } = useContext(SocketContext);
  const [userStatus, setUserStatus] = useState<{
    isOnline: boolean;
    lastOnline: Date;
  }>({
    isOnline: currentTargetUser.isOnline,
    lastOnline: currentTargetUser.lastOnline || new Date().toISOString(),
  });

  const selectedUserConversation =
    usersConversationsSummary[selectedConversationIndex];

    useEffect(() => {
    if (socket)
      socket.on('userStatus', ({ userId, isOnline, lastOnline }) => {
        if (Number(currentTargetUser.id) === userId) {
          setUserStatus({
            isOnline,
            lastOnline: lastOnline || new Date().toISOString(),
          });
        }
      });
  }, []);

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
                setSelectedConversationIndex={setSelectedConversationIndex}
                setCurrentConversation={setCurrentConversation}
              />
            ),
          )}
        </div>
        <div className="flex flex-col items-start pt-5 pl-4">
          <Link
            to={`/userProfile/${selectedUserConversation.id}`}
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
                {userStatus.isOnline ? (
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
                      last online:{' '}
                      {new Date(userStatus.lastOnline).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
        setSelectedConversationIndex={setSelectedConversationIndex}
      />
    </>
  );
}

function ChatMobile({
  currentConversation,
  setCurrentConversation,
  usersConversationsSummary,
  selectedConversationIndex,
  setSelectedConversationIndex,
}: {
  currentConversation: Message[];
  setCurrentConversation: React.Dispatch<React.SetStateAction<Message[]>>;
  usersConversationsSummary: UserConversationsSummary[];
  selectedConversationIndex: number;
  setSelectedConversationIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const location = useLocation();
  const routeWithParams = location.pathname.startsWith('/messages/');
  const [showChatBox, setShowChatBox] = useState<boolean>(routeWithParams);
  const selectedUserConversation =
    usersConversationsSummary[selectedConversationIndex];
  return (
    <>
      <main className="mt-8 mb-24 lg:hidden">
        {usersConversationsSummary.map(
          (userConversationSummary: UserConversationsSummary, index) => {
            if (userConversationSummary.lastMessage)
              return (
                <UserMessageCardMobile
                  setShowChatBox={setShowChatBox}
                  key={userConversationSummary.id}
                  targetUserInfo={userConversationSummary}
                  selectedConversationIndex={selectedConversationIndex}
                  currentIndex={index}
                  setSelectedConversationIndex={setSelectedConversationIndex}
                  setCurrentConversation={setCurrentConversation}
                />
              );
          },
        )}
      </main>
      {showChatBox ? (
        <ChatBoxMobile
          setShowChatBox={setShowChatBox}
          targetUser={usersConversationsSummary[selectedConversationIndex]}
          currentConversation={currentConversation}
          setSelectedConversationIndex={setSelectedConversationIndex}
          selectedUserConversation={selectedUserConversation}
        />
      ) : null}
    </>
  );
}

function UserMessageCardDesktop({
  targetUserInfo,
  selectedConversationIndex,
  setSelectedConversationIndex,
  currentIndex,
  setCurrentConversation,
}: {
  targetUserInfo: UserConversationsSummary;
  selectedConversationIndex: number;
  setSelectedConversationIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
  setCurrentConversation: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const { user } = useContext(UserContext);
  function handleClickUserMessageCard() {
    if (selectedConversationIndex !== currentIndex) {
      const token = localStorage.getItem('token');
      if (user && token) {
        getConversationBetweenTwoUsers({
          actorUserId: user.id,
          targetUserId: targetUserInfo.id,
          token,
        }).then((conversation: Message[]) => {
          setCurrentConversation(conversation);
          setSelectedConversationIndex(currentIndex);
        });
      }
    }
  }
  return (
    <button
      type="button"
      className={`border-grayDark-100 flex cursor-pointer items-center gap-2 border-b p-4 text-left first:rounded-t-lg last:rounded-b-lg last:border-none hover:bg-gray-50 ${selectedConversationIndex === currentIndex ? 'bg-gray-50' : ''}`}
      onClick={handleClickUserMessageCard}
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
  selectedConversationIndex,
  setSelectedConversationIndex,
  currentIndex,
  setCurrentConversation,
}: {
  setShowChatBox: React.Dispatch<React.SetStateAction<boolean>>;
  targetUserInfo: UserConversationsSummary;
  selectedConversationIndex: number;
  setSelectedConversationIndex: React.Dispatch<React.SetStateAction<number>>;
  currentIndex: number;
  setCurrentConversation: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const { user } = useContext(UserContext);
  function handleClickMessageCard() {
    setShowChatBox(true);
    if (selectedConversationIndex !== currentIndex) {
      const token = localStorage.getItem('token');
      if (user && token) {
        getConversationBetweenTwoUsers({
          actorUserId: user.id,
          targetUserId: targetUserInfo.id,
          token,
        }).then((conversation: Message[]) => {
          setCurrentConversation(conversation);
          setSelectedConversationIndex(currentIndex);
        });
      }
    }
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
        <div className="text-grayDark overflow-hidden text-xs overflow-ellipsis whitespace-nowrap">
          {targetUserInfo.lastMessage}
        </div>
      </div>
    </button>
  );
}

function ChatBoxDesktop({
  targetUserId,
  currentConversation,
  setSelectedConversationIndex,
}: {
  targetUserId: number;
  currentConversation: Message[];
  setSelectedConversationIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { user } = useContext(UserContext);
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
            time: new Date().toISOString(),
          },
          token,
        }).then(() => {
          setSelectedConversationIndex(0);
          setMessage('');
        });
    }
  }

  function handleChangeMessage(event: React.ChangeEvent<HTMLInputElement>) {
    const messageValue = event.target.value;
    setMessage(messageValue);
  }

  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [currentConversation]);

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

function ChatBoxMobile({
  setShowChatBox,
  targetUser,
  currentConversation,
  setSelectedConversationIndex,
  selectedUserConversation,
}: {
  setShowChatBox: React.Dispatch<React.SetStateAction<boolean>>;
  targetUser: UserConversationsSummary;
  currentConversation: Message[];
  setSelectedConversationIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedUserConversation: UserConversationsSummary;
}) {
  const { user } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const conversationRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>('');
  const [userStatus, setUserStatus] = useState<{
    isOnline: boolean;
    lastOnline: Date;
  }>({
    isOnline: targetUser.isOnline,
    lastOnline: targetUser.lastOnline || new Date().toISOString(),
  });
  function handleClickSendMessage(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (message.length) {
      const token = localStorage.getItem('token');
      if (user && token)
        sendMessage({
          targetUserId: targetUser.id,
          actorUserId: user.id,
          message: {
            userId: user.id,
            description: message,
            time: new Date().toISOString(),
          },
          token,
        }).then(() => {
          setSelectedConversationIndex(0);
          setMessage('');
        });
    }
  }
  function handleClickBackButton() {
    setShowChatBox(false);
  }
  function handleChangeMessage(event: React.ChangeEvent<HTMLInputElement>) {
    const messageValue = event.target.value;
    setMessage(messageValue);
  }
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
    if (socket)
      socket.on('userStatus', ({ userId, isOnline, lastOnline }) => {
        console.log(userId, isOnline, lastOnline);
        if (Number(targetUser.id) === userId) {
          setUserStatus({
            isOnline,
            lastOnline: lastOnline || new Date().toISOString(),
          });
        }
      });
  }, [currentConversation]);
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
          to={`/userProfile/${selectedUserConversation.id}`}
          className="flex items-center gap-2 text-left"
        >
          <img
            src={`${BACKEND_STATIC_FOLDER}${selectedUserConversation.imageUrl}`}
            alt="user"
            className="size-13 shrink-0 rounded-full object-cover"
          />
          <div className="flex min-w-0 flex-col">
            <span className="text-secondary text-sm font-semibold">
              {selectedUserConversation.username}
            </span>
            <div className="flex items-center gap-1">
              {userStatus.isOnline ? (
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
                    last online:{' '}
                    {new Date(userStatus.lastOnline).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden pb-5">
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
              className="cursor-pointer"
              onClick={handleClickSendMessage}
            >
              <SendMessageIcon className="fill-primary size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function TargetBoxMessage({ message }: { message: Message }) {
  const convertedTime = getCurrentTime({ time: message.time });
  return (
    <div className="flex w-fit max-w-120 flex-col items-start text-sm">
      <div className="bg-primary rounded-tr-2xl rounded-b-2xl p-4 break-all text-white">
        {message.description}
      </div>
      <div className="mt-1 flex w-full justify-end">
        <span className="text-grayDark font-light">{convertedTime}</span>
      </div>
    </div>
  );
}
function ActorBoxMessage({ message }: { message: Message }) {
  const convertedTime = getCurrentTime({ time: message.time });
  return (
    <div className="flex justify-end">
      <div className="flex w-fit max-w-120 flex-col items-start text-sm">
        <div className="text-secondary border-grayDark-100 rounded-tl-2xl rounded-b-2xl border-2 bg-white p-4 break-all">
          {message.description}
        </div>
        <div className="mt-1 flex w-full justify-end">
          <span className="text-grayDark font-light">{convertedTime}</span>
        </div>
      </div>
    </div>
  );
}

function getCurrentTime({ time }: { time: string }) {
  const date = new Date(time);
  const convertedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return convertedTime;
}
