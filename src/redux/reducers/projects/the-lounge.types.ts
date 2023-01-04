export type Joining = boolean;

export type Token = string | null;

export type User =
{
  id: string,
  name: string,
  status: 'online' | 'away' | 'reconnect' | 'offline'
};

export type Chat =
{
  id: string,
  userId: string,
  message: string,
  timestamp: string,
  status: 'sending' | 'pending' | 'sent'
};

export type Info =
{
  id: string,
  userId: string,
  activity: 'join' | 'leave',
  timestamp: string
};

export type Conversation =
{
  date: string,
  chats: Chat[],
  infos: Info[]
};

export type Status = string;

export type Message = string;
