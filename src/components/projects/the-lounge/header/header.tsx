import styles from './header.module.scss';

type Header =
{
  title: string,
  subtitle?: string | (() => string)
};

const Header = ({title, subtitle}: Header): JSX.Element =>
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
  </div>
);

export default Header;
