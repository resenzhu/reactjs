import {WebStorage} from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

type Config =
{
  key: string,
  storage: WebStorage,
  version: number,
  whitelist: string[]
};

export const createConfig = (key: string, whitelist: string[] = []): Config =>
(
  {
    key: key,
    storage: sessionStorage,
    version: 1,
    whitelist: whitelist
  }
);
