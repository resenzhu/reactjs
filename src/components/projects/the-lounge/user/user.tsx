import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircleDot} from '@fortawesome/free-solid-svg-icons';
import styles from './user.module.scss';

type User =
{
  name: string,
  status: 'online' | 'away'
};

const User = ({name, status}: User): JSX.Element =>
(
  <div className={styles.user}>
    <div className={styles.name}>
      {name}
    </div>
    <div className={styles.status}>
      <div className={`${styles.dot} ${status === 'online' ? styles.online : styles.away}`}>
        <FontAwesomeIcon icon={faCircleDot} />
      </div>
      <div className={styles.description}>
        {status}
      </div>
    </div>
  </div>
);

export default User;
