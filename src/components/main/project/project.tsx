import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {Link} from 'react-router-dom';
import styles from './project.module.scss';

type Project =
{
  background: string,
  icon: IconDefinition,
  name: string,
  slogan: string,
  url: string
};

const Project = ({background, icon, name, slogan, url}: Project): JSX.Element =>
(
  <div
    className={styles.project}
    style={{backgroundImage: `linear-gradient(#00000085, #00000085), url('${background}')`}}
  >
    <Link
      to={url}
      target='_blank'
      rel='noopener noreferrer'
    >
      <div className={styles.icon}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className={styles.name}>
        {name}
      </div>
      <div className={styles.slogan}>
        {slogan}
      </div>
    </Link>
  </div>
);

export default Project;
