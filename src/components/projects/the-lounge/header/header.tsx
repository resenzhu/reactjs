import {faInfoCircle, faUsers} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {MouseEventHandler} from 'react';
import styles from './header.module.scss';

type Header =
{
  title: string,
  subtitle?: string | (() => string),
  onclickusers?: MouseEventHandler<HTMLDivElement>,
  onclickinfo?: MouseEventHandler<HTMLDivElement>
};

const Header = ({title, subtitle, onclickusers, onclickinfo}: Header): JSX.Element =>
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
      (onclickusers || onclickinfo) &&
      <div className={styles.menu}>
        {
          onclickusers &&
          <div className={styles.users} onClick={onclickusers}>
            <FontAwesomeIcon icon={faUsers} />
          </div>
        }
        {
          onclickinfo &&
          <div className={styles.info} onClick={onclickinfo}>
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
        }
      </div>
    }
  </div>
);

export default Header;
