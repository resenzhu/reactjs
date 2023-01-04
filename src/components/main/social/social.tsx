import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/free-solid-svg-icons';
import styles from './social.module.scss';

type Social =
{
  icon: IconDefinition,
  url: string,
  ariaLabel?: string
};

const Social = ({icon, url, ariaLabel}: Social): JSX.Element =>
(
  <a
    className={styles.social}
    href={url}
    target='_blank'
    rel='noopener noreferrer'
    aria-label={ariaLabel}
  >
    <FontAwesomeIcon icon={icon} />
  </a>
);

export default Social;
