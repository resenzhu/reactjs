import {ReactNode} from 'react';
import styles from './changelog.module.scss';

type Changelog =
{
  children: ReactNode
};

type Update =
{
  version: string,
  children: ReactNode
};

type Log =
{
  children: string
};

const Changelog = ({children}: Changelog): JSX.Element =>
(
  <div className={styles.changelog}>
    {children}
  </div>
);

const Update = ({version, children}: Update): JSX.Element =>
(
  <div className={styles.update}>
    <div className={styles.version}>
      {version}
    </div>
    <ul className={styles.loglist}>
      {children}
    </ul>
  </div>
);

const Log = ({children}: Log): JSX.Element =>
(
  <li>
    {children}
  </li>
);

Changelog.Update = Update;
Changelog.Log = Log;

export default Changelog;
