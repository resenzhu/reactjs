import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MouseEventHandler} from 'react';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import styles from './header.module.scss';

type Header =
{
  title: string,
  subtitle?: string | (() => string),
  onclickusers?: MouseEventHandler<HTMLDivElement>
};

const Header = ({title, subtitle, onclickusers}: Header): JSX.Element =>
(
  <div className={styles.header}>
    <div className={styles.room}>
      <div className={styles.name}>
        {title}
      </div>
      {
        subtitle &&
        <div className={styles.info}>
          {typeof subtitle === 'string' ? subtitle : subtitle()}
        </div>
      }
    </div>
    {
      onclickusers &&
      <div className={styles.menu}>
        {
          onclickusers &&
          <div className={styles.users} onClick={onclickusers}>
            <FontAwesomeIcon icon={faUsers} />
          </div>
        }
      </div>
    }
  </div>
);

export default Header;
