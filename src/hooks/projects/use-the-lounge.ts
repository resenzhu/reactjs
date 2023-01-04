import {Chat, Conversation, Info, Joining, Message, Status, Token, User} from './../../redux/reducers/projects/the-lounge.types';
import {addChat as addTheLoungeChat, addInfo as addTheLoungeInfo, addUser as addTheLoungeUser, deleteChat as deleteTheLoungeChat, editChat as editTheLoungeChat, editUser as editTheLoungeUser, setConversations as setTheLoungeConversations, setJoining as setTheLoungeJoining, setMessage as setTheLoungeMessage, setStatus as setTheLoungeStatus, setToken as setTheLoungeToken} from './../../redux/reducers/projects/the-lounge';
import {useDispatch, useSelector} from './../../redux/hooks';

type UseTheLounge =
{
  joining: Joining,
  token: Token,
  users: User[],
  conversations: Conversation[],
  status: Status,
  message: Message,
  setJoining: (joining: Joining) => void,
  setToken: (token: Token) => void,
  addUser: (user: User) => void,
  editUser: (user: User) => void,
  setConversations: (conversations: Conversation[]) => void,
  addChat: (chat: Chat) => void,
  editChat: (chat: Chat) => void,
  deleteChat: (chat: Chat) => void,
  addInfo: (info: Info) => void,
  setStatus: (status: Status) => void,
  setMessage: (message: Message) => void
};

const useTheLounge = (): UseTheLounge =>
{
  const dispatch = useDispatch();

  const setJoining = (joining: Joining): void =>
  {
    dispatch(setTheLoungeJoining(joining));
  };

  const setToken = (token: Token): void =>
  {
    dispatch(setTheLoungeToken(token));
  };

  const addUser = (user: User): void =>
  {
    dispatch(addTheLoungeUser(user));
  };

  const editUser = (user: User): void =>
  {
    dispatch(editTheLoungeUser(user));
  };

  const setConversations = (conversations: Conversation[]): void =>
  {
    dispatch(setTheLoungeConversations(conversations));
  };

  const addChat = (chat: Chat): void =>
  {
    dispatch(addTheLoungeChat(chat));
  };

  const editChat = (chat: Chat): void =>
  {
    dispatch(editTheLoungeChat(chat));
  };

  const deleteChat = (chat: Chat): void =>
  {
    dispatch(deleteTheLoungeChat(chat));
  };

  const addInfo = (info: Info): void =>
  {
    dispatch(addTheLoungeInfo(info));
  };

  const setStatus = (status: Status): void =>
  {
    dispatch(setTheLoungeStatus(status));
  };

  const setMessage = (message: Message): void =>
  {
    dispatch(setTheLoungeMessage(message));
  };

  return {
    joining: useSelector((state) => state.theLounge.joining),
    token: useSelector((state) => state.theLounge.token),
    users: useSelector((state) => state.theLounge.users),
    conversations: useSelector((state) => state.theLounge.conversations),
    status: useSelector((state) => state.theLounge.status),
    message: useSelector((state) => state.theLounge.message),
    setJoining: setJoining,
    setToken: setToken,
    addUser: addUser,
    editUser: editUser,
    setConversations: setConversations,
    addChat: addChat,
    editChat: editChat,
    deleteChat: deleteChat,
    addInfo: addInfo,
    setStatus: setStatus,
    setMessage: setMessage
  };
};

export default useTheLounge;
