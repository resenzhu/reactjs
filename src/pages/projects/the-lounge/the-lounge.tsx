import {ChangeEvent, HTMLAttributeAnchorTarget, MouseEvent, useEffect, useRef, useState} from 'react';
import {Chat, Conversation, Info, Token, User} from './../../../redux/reducers/projects/the-lounge.types';
import {Conversation as Convo, Header, Sender, Sidebar, User as Usr} from './../../../components/projects/the-lounge/index';
import {DateTime} from 'luxon';
import {Seo} from './../../../components/main';
import decodeJwt from 'jwt-decode';
import linkifyHtml from 'linkify-html';
import {nanoid} from 'nanoid';
import styles from './the-lounge.module.scss';
import {theLoungeSocket} from './../../../utils/socket';
import {useIdleTimer} from 'react-idle-timer';
import {useLayout} from './../../../hooks/main/index';
import {useTheLounge} from './../../../hooks/projects/index';
import {useTranslation} from './../../../hooks/main';

type LinkifyHTMLOptions =
{
  defaultProtocol: 'http' | 'https' | 'ftp' | 'ftps',
  target: HTMLAttributeAnchorTarget,
  rel: string
};

type IntDecodedToken =
{
  id: string,
  exp: number,
  iat: number
};

type ResUser =
{
  id: string,
  name: string,
  status: 'online' | 'away' | 'reconnect' | 'offline'
};

type ResChat =
{
  id: string,
  userId: string,
  message: string,
  timestamp: string
};

type ResInfo =
{
  id: string,
  userId: string,
  activity: 'join' | 'leave',
  timestamp: string
};

type ResMessage = ResChat | ResInfo;

type ReqGetMessages =
{
  token: string
};

type ResGetMessages =
{
  messages: ResMessage[]
};

type ReqVerifyToken =
{
  token: Token
};

type ResVerifyToken =
{
  token: string
};

type ReqGetUsers =
{
  token: string
};

type ResGetUsers =
{
  users: ResUser[]
};

type ReqSendMessage =
{
  token: string,
  tempChat:
  {
    id: string,
    message: string
  }
};

type ResSendMessage =
{
  tempChatId: string,
  sentChat: ResChat
};

type ReqJoinConversation =
{
  token: string
};

type ReqUpdateUser =
{
  token: string,
  user:
  {
    name: string,
    status: 'online' | 'away' | 'reconnect' | 'offline'
  }
};

type ResUpdateUser =
{
  user: ResUser
};

type ResUpdateChat =
{
  chat: ResChat
};

type ResUpdateInfo =
{
  info: ResInfo
};

const TheLounge = (): JSX.Element =>
{
  const {conversations, joining, message: userMessage, status: headerStatus, token: currentToken, users, addChat, addInfo, addUser, deleteChat, editChat, editUser, setConversations, setJoining, setMessage, setStatus, setToken} = useTheLounge();

  const conversationsRef = useRef<Conversation[]>(conversations);

  const {i18next, translate} = useTranslation('project.theLounge');

  const [loading, setLoading] = useState<boolean>(false);

  const {online, viewport} = useLayout();

  const [showInfo, setShowInfo] = useState<boolean>(false);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  const [showUsers, setShowUsers] = useState<boolean>(false);

  const usersRef = useRef<User[]>(users);

  const disableSender = !online || joining || userMessage.trim().length === 0;

  const linkifyHTMLOptions: LinkifyHTMLOptions =
  {
    defaultProtocol: 'https',
    target: '_blank',
    rel: 'noopener noreferrer'
  };

  const getMessages = (token: string): Promise<ResMessage[]> =>
  (
    new Promise((resolve): void =>
    {
      const reqGetMessages: ReqGetMessages =
      {
        token: token
      };

      theLoungeSocket.emit('get-messages', reqGetMessages);

      theLoungeSocket.once('get-messages-response', (response): void =>
      {
        if (response.success)
        {
          const resGetMessages = response.data as ResGetMessages;

          resolve(resGetMessages.messages);
        }
      });
    })
  );

  const getToken = (): Promise<string> =>
  (
    new Promise((resolve): void =>
    {
      try
      {
        if (currentToken)
        {
          const expirationDate = (decodeJwt(currentToken) as IntDecodedToken).exp;

          const currentDate = Date.now().valueOf() / 1000;

          if (expirationDate < currentDate)
          {
            throw new Error();
          }

          resolve(currentToken);
        }

        throw new Error();
      }
      catch
      {
        const reqVerifyToken: ReqVerifyToken =
        {
          token: currentToken
        };

        theLoungeSocket.emit('verify-token', reqVerifyToken);

        theLoungeSocket.once('verify-token-response', (response): void =>
        {
          if (response.success)
          {
            const resVerifyToken = response.data as ResVerifyToken;

            resolve(resVerifyToken.token);
          }
        });
      }
    })
  );

  const getUsers = (token: string): Promise<ResUser[]> =>
  (
    new Promise((resolve): void =>
    {
      const reqGetUsers: ReqGetUsers =
      {
        token: token
      };

      theLoungeSocket.emit('get-users', reqGetUsers);

      theLoungeSocket.once('get-users-response', (response): void =>
      {
        if (response.success)
        {
          const resGetUsers = response.data as ResGetUsers;

          resolve(resGetUsers.users);
        }
      });
    })
  );

  const handleAddMessageNewline = (): void =>
  {
    setMessage(`${userMessage}\n`);
  };

  const handleDeleteMessage = (chat: Chat): void =>
  {
    deleteChat(chat);
  };

  const handleToggleInfoSidebar = (show: boolean): void =>
  {
    if (currentToken)
    {
      if (show)
      {
        setShowUsers(!show);
      }

      setShowSidebar(show);
      setShowInfo(show);
    }
  };

  const handleToggleUsersSidebar = (show: boolean): void =>
  {
    if (currentToken)
    {
      if (show)
      {
        setShowInfo(!show);
      }

      setShowSidebar(show);
      setShowUsers(show);
    }
  };

  const resendMessage = (pendingChat: Chat): void =>
  {
    getToken().then((token): void =>
    {
      const sendingChat: Chat =
      {
        ...pendingChat,
        status: 'sending'
      };

      editChat(sendingChat);

      if (theLoungeSocket.connected)
      {
        const reqSendMessage: ReqSendMessage =
        {
          token: token,
          tempChat:
          {
            id: sendingChat.id,
            message: sendingChat.message
          }
        };

        theLoungeSocket.emit('send-message', reqSendMessage);

        if (!theLoungeSocket.hasListeners('send-message-response'))
        {
          theLoungeSocket.on('send-message-response', (response): void =>
          {
            if (response.success)
            {
              const resSendMessage = response.data as ResSendMessage;

              const newChat: Chat =
              {
                id: resSendMessage.sentChat.id,
                userId: resSendMessage.sentChat.userId,
                message: resSendMessage.sentChat.message,
                timestamp: resSendMessage.sentChat.timestamp,
                status: 'sent'
              };

              const updatedConversations = conversationsRef.current.map((existingConversation): Conversation =>
              {
                if (existingConversation.chats.some((existingChat): boolean => existingChat.id === resSendMessage.tempChatId))
                {
                  const updatedChats: Chat[] = existingConversation.chats.map((existingChat): Chat =>
                  {
                    if (existingChat.id === resSendMessage.tempChatId)
                    {
                      const updatedChat: Chat =
                      {
                        ...existingChat,
                        id: newChat.id,
                        userId: newChat.userId,
                        message: newChat.message,
                        timestamp: newChat.timestamp,
                        status: newChat.status
                      };

                      return updatedChat;
                    }

                    return existingChat;
                  });

                  const updatedConversation: Conversation =
                  {
                    ...existingConversation,
                    chats: updatedChats
                  };

                  return updatedConversation;
                }

                return existingConversation;
              });

              setConversations(updatedConversations);
            }
          });
        }
      }

      setTimeout((): void =>
      {
        if (conversationsRef.current.some((existingConversation): boolean => existingConversation.chats.some((existingChat): boolean => existingChat.id === pendingChat.id)))
        {
          editChat(pendingChat);
        }
      },
      5000);
    });
  };

  const handleResendMessage = (chat: Chat): void =>
  {
    resendMessage(chat);
  };

  const sendMessage = (message: string): void =>
  {
    setMessage('');

    getToken().then((token): void =>
    {
      const tempChat: Chat =
      {
        id: nanoid(),
        userId: (decodeJwt(token) as IntDecodedToken).id,
        message: message,
        timestamp: DateTime.utc().toISO(),
        status: 'sending'
      };

      addChat(tempChat);

      if (theLoungeSocket.connected)
      {
        const reqSendMessage: ReqSendMessage =
        {
          token: token,
          tempChat:
          {
            id: tempChat.id,
            message: tempChat.message
          }
        };

        theLoungeSocket.emit('send-message', reqSendMessage);

        if (!theLoungeSocket.hasListeners('send-message-response'))
        {
          theLoungeSocket.on('send-message-response', (response): void =>
          {
            if (response.success)
            {
              const resSendMessage = response.data as ResSendMessage;

              const newChat: Chat =
              {
                id: resSendMessage.sentChat.id,
                userId: resSendMessage.sentChat.userId,
                message: resSendMessage.sentChat.message,
                timestamp: resSendMessage.sentChat.timestamp,
                status: 'sent'
              };

              const updatedConversations = conversationsRef.current.map((existingConversation): Conversation =>
              {
                if (existingConversation.chats.some((existingChat): boolean => existingChat.id === resSendMessage.tempChatId))
                {
                  const updatedChats: Chat[] = existingConversation.chats.map((existingChat): Chat =>
                  {
                    if (existingChat.id === resSendMessage.tempChatId)
                    {
                      const updatedChat: Chat =
                      {
                        ...existingChat,
                        id: newChat.id,
                        userId: newChat.userId,
                        message: newChat.message,
                        timestamp: newChat.timestamp,
                        status: newChat.status
                      };

                      return updatedChat;
                    }

                    return existingChat;
                  });

                  const updatedConversation: Conversation =
                  {
                    ...existingConversation,
                    chats: updatedChats
                  };

                  return updatedConversation;
                }

                return existingConversation;
              });

              setConversations(updatedConversations);
            }
          });
        }
      }

      setTimeout((): void =>
      {
        if (conversationsRef.current.some((existingConversation): boolean => existingConversation.chats.some((existingChat): boolean => existingChat.id === tempChat.id)))
        {
          const pendingChat: Chat =
          {
            ...tempChat,
            status: 'pending'
          };

          editChat(pendingChat);
        }
      },
      5000);
    });
  };

  const handleSendMessage = (event: MouseEvent<HTMLButtonElement>): void =>
  {
    event?.preventDefault();

    if (!disableSender)
    {
      sendMessage(userMessage.replaceAll('\n', '\\n'));
    }
  };

  const handleUpdateMessage = (event: ChangeEvent<HTMLTextAreaElement>): void =>
  {
    setMessage(event.target.value);
  };

  const joinConversation = (token: string): Promise<void> =>
  (
    new Promise((resolve): void =>
    {
      const reqJoinConversation: ReqJoinConversation =
      {
        token: token
      };

      theLoungeSocket.emit('join-conversation', reqJoinConversation);

      theLoungeSocket.once('join-conversation-response', (response): void =>
      {
        if (response.success)
        {
          resolve();
        }
      });
    })
  );

  const updateHeaderStatus = (): void =>
  {
    if (online)
    {
      if (joining)
      {
        const newStatus = translate('header.subtitle.joining');

        if (headerStatus !== newStatus)
        {
          setStatus(newStatus);
        }
      }
      else
      {
        const joinedUserCount = users.filter((existingUser): boolean => existingUser.status !== 'reconnect' && existingUser.status !== 'offline').length;

        const newStatus = translate(`header.subtitle.joined.${joinedUserCount <= 1 ? 'single' : 'multiple'}`, {count: joinedUserCount});

        if (headerStatus.length !== 0 && headerStatus !== newStatus)
        {
          setStatus(newStatus);
        }
      }
    }
    else
    {
      const newStatus = translate('header.subtitle.offline');

      if (headerStatus !== newStatus)
      {
        setStatus(newStatus);
      }
    }
  };

  const updateUserStatus = (status: 'online' | 'away') =>
  {
    if (theLoungeSocket.connected)
    {
      getToken().then((token): void =>
      {
        const userId = (decodeJwt(token) as IntDecodedToken).id;

        const user = users.find((existingUser): boolean => existingUser.id === userId);

        if (user)
        {
          const updatedUser: User =
          {
            ...user,
            status: status
          };

          const reqUpdateUser: ReqUpdateUser =
          {
            token: token,
            user:
            {
              name: updatedUser.name,
              status: updatedUser.status
            }
          };

          theLoungeSocket.emit('update-user', reqUpdateUser);
        }
      });
    }
  };

  const idleTimer = useIdleTimer(
  {
    name: 'idle-timer',
    startOnMount: false,
    startManually: true,
    timeout: 120000,
    onIdle: (): void => updateUserStatus('away'),
    onActive: (): void => updateUserStatus('online')
  });

  useEffect((): () => void =>
  {
    if (!loading)
    {
      setLoading(true);
    }

    return (): void =>
    {
      theLoungeSocket.removeAllListeners();

      theLoungeSocket.disconnect();

      i18next.off('languageChanged', updateHeaderStatus);
    };
  },
  []);

  useEffect((): void =>
  {
    if (loading)
    {
      if (!theLoungeSocket.connected)
      {
        theLoungeSocket.connect();
      }

      if (!theLoungeSocket.hasListeners('update-user-response'))
      {
        theLoungeSocket.on('update-user-response', (response): void =>
        {
          if (response.success)
          {
            const resUpdateUser = response.data as ResUpdateUser;

            const newUser: User =
            {
              id: resUpdateUser.user.id,
              name: resUpdateUser.user.name,
              status: resUpdateUser.user.status
            };

            if (usersRef.current.some((existingUser): boolean => existingUser.id === newUser.id))
            {
              editUser(newUser);
            }
            else
            {
              addUser(newUser);
            }
          }
        });
      }

      if (!theLoungeSocket.hasListeners('update-chat-response'))
      {
        theLoungeSocket.on('update-chat-response', (response): void =>
        {
          if (response.success)
          {
            const resUpdateChat = response.data as ResUpdateChat;

            const newChat: Chat =
            {
              id: resUpdateChat.chat.id,
              userId: resUpdateChat.chat.userId,
              message: resUpdateChat.chat.message,
              timestamp: resUpdateChat.chat.timestamp,
              status: 'sent'
            };

            if (conversationsRef.current.some((existingConversation): boolean => existingConversation.chats.some((existingChat): boolean => existingChat.id === newChat.id)))
            {
              editChat(newChat);
            }
            else
            {
              addChat(newChat);
            }
          }
        });
      }

      if (!theLoungeSocket.hasListeners('update-info-response'))
      {
        theLoungeSocket.on('update-info-response', (response): void =>
        {
          if (response.success)
          {
            const resUpdateInfo = response.data as ResUpdateInfo;

            const newInfo: Info =
            {
              id: resUpdateInfo.info.id,
              userId: resUpdateInfo.info.userId,
              activity: resUpdateInfo.info.activity,
              timestamp: resUpdateInfo.info.timestamp
            };

            if (!conversationsRef.current.some((existingConversation): boolean => existingConversation.infos.some((existingInfo): boolean => existingInfo.id === newInfo.id)))
            {
              addInfo(newInfo);
            }
          }
        });
      }

      i18next.on('languageChanged', updateHeaderStatus);

      setJoining(true);

      setLoading(false);
    }
  },
  [loading]);

  useEffect((): void =>
  {
    if (joining)
    {
      getToken().then((token): void =>
      {
        joinConversation(token).then((): void =>
        {
          getUsers(token).then((newUsers): void =>
          {
            for (const user of newUsers)
            {
              const newUser: User =
              {
                id: user.id,
                name: user.name,
                status: user.status
              };

              addUser(newUser);
            }
          });

          getMessages(token).then((newMessages): void =>
          {
            for (const message of newMessages)
            {
              const chat = message as ResChat;
              const info = message as ResInfo;

              if (chat.message)
              {
                const newChat: Chat =
                {
                  id: chat.id,
                  userId: chat.userId,
                  message: chat.message,
                  timestamp: chat.timestamp,
                  status: 'sent'
                };

                addChat(newChat);
              }
              else
              {
                const newInfo: Info =
                {
                  id: info.id,
                  userId: info.userId,
                  activity: info.activity,
                  timestamp: info.timestamp
                };

                addInfo(newInfo);
              }
            }
          });
        })
        .finally((): void =>
        {
          setToken(token);

          setJoining(false);

          idleTimer.start();
        });
      });
    }
  },
  [joining]);

  useEffect((): void =>
  {
    updateHeaderStatus();
  },
  [online, joining, users]);

  useEffect((): void =>
  {
    usersRef.current = users;
  },
  [users]);

  useEffect((): void =>
  {
    conversationsRef.current = conversations;
  },
  [conversations]);

  return (
    <>
      <Seo
        title={translate('seo.title')}
        description={translate('seo.description')}
      />
      <div className={styles.background}>
        <div className={styles.app}>
          <Header
            title={translate('header.title')}
            subtitle={headerStatus}
            onclickusers={(): void => handleToggleUsersSidebar(!showUsers)}
            onclickinfo={(): void => handleToggleInfoSidebar(!showInfo)}
          />
          <div className={styles.body}>
            {
              currentToken && !(viewport.width < 576 && showSidebar) &&
              <Convo>
                {
                  conversations.map((existingConversation): JSX.Element[] =>
                  {
                    const userId = (decodeJwt(currentToken) as IntDecodedToken).id;

                    const elements: JSX.Element[] =
                    [
                      <Convo.Info
                        key={existingConversation.date}
                        message={DateTime.fromISO(existingConversation.date).toFormat('dd/MM/yyyy')}
                      />
                    ];

                    let contents: (Chat | Info)[] = [];

                    for (const chat of existingConversation.chats)
                    {
                      contents.push(chat);
                    }

                    for (const info of existingConversation.infos)
                    {
                      contents.push(info);
                    }

                    contents = contents.sort((first, second): number => DateTime.fromISO(first.timestamp).toMillis() - DateTime.fromISO(second.timestamp).toMillis());

                    contents.forEach((content, index): void =>
                    {
                      if ((content as Chat).message)
                      {
                        const chat = content as Chat;

                        const {id} = chat;

                        const type = chat.userId === userId ? 'firstPerson' : 'thirdPerson';

                        const header = !(index !== 0 && (contents[index - 1] as Chat).userId === chat.userId && (contents[index - 1] as Chat).message);

                        const username = users.find((existingUser): boolean => existingUser.id === chat.userId)?.name ?? chat.userId;

                        const message = linkifyHtml(chat.message, linkifyHTMLOptions).replaceAll('\\n', '\n').replaceAll(/\*([^*]*)\*/gu, '<b>$1</b>').replaceAll(/_([^_]*)_/gu, '<i>$1</i>').replaceAll(/~([^~]*)~/gu, '<s>$1</s>');

                        const time = DateTime.fromISO(chat.timestamp).toLocal().toLocaleString(DateTime.TIME_SIMPLE);

                        const {status} = chat;

                        elements.push(
                          <Convo.Chat
                            key={id}
                            type={type}
                            header={header}
                            username={username}
                            message={message}
                            time={time}
                            status={status}
                            onretry={(): void => handleResendMessage(chat)}
                            ondelete={(): void => handleDeleteMessage(chat)}
                          />
                        );
                      }
                      else
                      {
                        const info = content as Info;

                        const {id} = info;

                        const username = users.find((existingUser): boolean => existingUser.id === info.userId)?.name ?? info.userId;

                        const time = DateTime.fromISO(info.timestamp).toLocal().toLocaleString(DateTime.TIME_SIMPLE);

                        let message: string = '';

                        switch (info.activity)
                        {
                          case 'join':
                            message = info.userId === userId ? translate('conversation.info.join.firstPerson') : translate('conversation.info.join.thirdPerson', {name: username});
                            break;

                          case 'leave':
                            message = translate('conversation.info.leave', {name: username});
                            break;

                          default:
                            message = '';
                            break;
                        }

                        elements.push(
                          <Convo.Info
                            key={id}
                            message={message}
                            time={time}
                          />
                        );
                      }
                    });

                    return elements;
                  })
                }
              </Convo>
            }
            {
              currentToken && showSidebar &&
              <Sidebar>
                {
                  headerStatus === translate('header.subtitle.offline') &&
                  <div className={styles.offline}>
                    {translate('sidebar.offline')}
                  </div>
                }
                {
                  headerStatus !== translate('header.subtitle.offline') && showUsers &&
                  [...users].sort((first, second): number => first.name.localeCompare(second.name)).map((existingUser): JSX.Element[] =>
                  {
                    const elements: JSX.Element[] = [];

                    const userId = (decodeJwt(currentToken) as IntDecodedToken).id;

                    if (existingUser.status === 'online' || existingUser.status === 'away')
                    {
                      const {id} = existingUser;

                      const name = id === userId ? `${existingUser.name} (${translate('sidebar.users.you')})` : existingUser.name;

                      const {status} = existingUser;

                      elements.push(
                        <Usr
                          key={id}
                          name={name}
                          status={status}
                        />
                      );
                    }

                    return elements;
                  })
                }
                {
                  headerStatus !== translate('header.subtitle.offline') && showInfo &&
                  <div>INFO</div>
                }
              </Sidebar>
            }
          </div>
          <Sender
            placeholder={translate('sender.message.placeholder')}
            value={userMessage}
            disabled={disableSender}
            onenter={handleSendMessage}
            onaltenter={handleAddMessageNewline}
            onchange={handleUpdateMessage}
            onsubmit={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default TheLounge;
