import {Chat, Conversation, Info, Joining, Message, Status, Token, User} from './the-lounge.types';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {DateTime} from 'luxon';

type State =
{
  joining: Joining,
  token: Token,
  users: User[],
  conversations: Conversation[],
  status: Status,
  message: Message
};

type Reducers =
{
  setJoining: (state: State, action: PayloadAction<Joining>) => void,
  setToken: (state: State, action: PayloadAction<Token>) => void,
  addUser: (state: State, action: PayloadAction<User>) => void,
  editUser: (state: State, action: PayloadAction<User>) => void,
  setConversations: (state: State, action: PayloadAction<Conversation[]>) => void,
  addChat: (state: State, action: PayloadAction<Chat>) => void,
  editChat: (state: State, action: PayloadAction<Chat>) => void,
  deleteChat: (state: State, action: PayloadAction<Chat>) => void,
  addInfo: (state: State, action: PayloadAction<Info>) => void,
  setStatus: (state: State, action: PayloadAction<Status>) => void,
  setMessage: (state: State, action: PayloadAction<Message>) => void
};

const name: string = 'theLounge';

const initialState: State =
{
  joining: false,
  token: null,
  users: [],
  conversations: [],
  status: '',
  message: ''
};

const reducers: Reducers =
{
  setJoining: (state, action) =>
  {
    if (state.joining !== action.payload)
    {
      state.joining = action.payload;
    }
  },
  setToken: (state, action) =>
  {
    if (state.token !== action.payload)
    {
      state.token = action.payload;
    }
  },
  addUser: (state, action) =>
  {
    if (!state.users.some((user): boolean => user.id === action.payload.id))
    {
      state.users =
      [
        ...state.users,
        action.payload
      ];
    }
  },
  editUser: (state, action) =>
  {
    if (state.users.some((user): boolean => user.id === action.payload.id))
    {
      state.users = state.users.map((user): User =>
      {
        if (user.id === action.payload.id)
        {
          const updatedUser: User =
          {
            ...user,
            name: action.payload.name,
            status: action.payload.status
          };

          return updatedUser;
        }

        return user;
      });
    }
  },
  setConversations: (state, action) =>
  {
    if (JSON.stringify(state.conversations) !== JSON.stringify(action.payload))
    {
      state.conversations = action.payload;
    }
  },
  addChat: (state, action) =>
  {
    const conversationDateFormat: string = 'dd/MM/yyyy';

    const chatTimestamp = DateTime.fromISO(action.payload.timestamp);

    if (state.conversations.some((conversation): boolean => DateTime.fromISO(conversation.date).toFormat(conversationDateFormat) === chatTimestamp.toFormat(conversationDateFormat)))
    {
      state.conversations = state.conversations.map((conversation): Conversation =>
      {
        if (DateTime.fromISO(conversation.date).toFormat(conversationDateFormat) === chatTimestamp.toFormat(conversationDateFormat) && !conversation.chats.some((chat): boolean => chat.id === action.payload.id))
        {
          const updatedConversation: Conversation =
          {
            ...conversation,
            chats:
            [
              ...conversation.chats,
              action.payload
            ]
          };

          return updatedConversation;
        }

        return conversation;
      });
    }
    else
    {
      state.conversations =
      [
        ...state.conversations,
        {
          date: action.payload.timestamp,
          chats: [action.payload],
          infos: []
        }
      ];
    }
  },
  editChat: (state, action) =>
  {
    if (state.conversations.some((conversation): boolean => conversation.chats.some((chat): boolean => chat.id === action.payload.id)))
    {
      state.conversations = state.conversations.map((conversation): Conversation =>
      {
        conversation.chats = conversation.chats.map((chat): Chat =>
        {
          if (chat.id === action.payload.id)
          {
            const updatedChat: Chat =
            {
              ...chat,
              userId: action.payload.userId,
              message: action.payload.message,
              timestamp: action.payload.timestamp,
              status: action.payload.status
            };

            return updatedChat;
          }

          return chat;
        });

        return conversation;
      });
    }
  },
  deleteChat: (state, action) =>
  {
    if (state.conversations.some((conversation): boolean => conversation.chats.some((chat): boolean => chat.id === action.payload.id)))
    {
      state.conversations = state.conversations.map((conversation): Conversation =>
      {
        if (conversation.chats.some((chat): boolean => chat.id === action.payload.id))
        {
          const chatIndex = conversation.chats.map((chat): string => chat.id).indexOf(action.payload.id);

          const updatedConversation: Conversation =
          {
            ...conversation,
            chats: chatIndex === -1 ? [...conversation.chats] : [...conversation.chats.slice(0, chatIndex), ...conversation.chats.slice(chatIndex + 1)]
          };

          return updatedConversation;
        }

        return conversation;
      });
    }
  },
  addInfo: (state, action) =>
  {
    const conversationDateFormat: string = 'dd/MM/yyyy';

    const infoTimestamp = DateTime.fromISO(action.payload.timestamp);

    if (state.conversations.some((conversation): boolean => DateTime.fromISO(conversation.date).toFormat(conversationDateFormat) === infoTimestamp.toFormat(conversationDateFormat)))
    {
      state.conversations = state.conversations.map((conversation): Conversation =>
      {
        if (DateTime.fromISO(conversation.date).toFormat(conversationDateFormat) === infoTimestamp.toFormat(conversationDateFormat) && !conversation.infos.some((info): boolean => info.id === action.payload.id))
        {
          const updatedConversation: Conversation =
          {
            ...conversation,
            infos:
            [
              ...conversation.infos,
              action.payload
            ]
          };

          return updatedConversation;
        }

        return conversation;
      });
    }
    else
    {
      state.conversations =
      [
        ...state.conversations,
        {
          date: action.payload.timestamp,
          infos: [action.payload],
          chats: []
        }
      ];
    }
  },
  setStatus: (state, action) =>
  {
    if (state.status !== action.payload)
    {
      state.status = action.payload;
    }
  },
  setMessage: (state, action) =>
  {
    if (state.message !== action.payload)
    {
      state.message = action.payload;
    }
  }
};

const slice = createSlice(
{
  name: name,
  initialState: initialState,
  reducers: reducers
});

export const {setJoining, setToken, addUser, editUser, setConversations, addChat, editChat, deleteChat, addInfo, setStatus, setMessage} = slice.actions;

export default slice.reducer;
