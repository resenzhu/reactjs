import type {ReactNode} from 'react';
import styles from './sidebar.module.scss';

type Sidebar =
{
  children: ReactNode
};

const Sidebar = ({children}: Sidebar): JSX.Element =>
(
  <div className={styles.sidebar}>
    {children}
  </div>
);

export default Sidebar;
