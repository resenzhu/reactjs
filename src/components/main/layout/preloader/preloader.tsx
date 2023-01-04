import preloaderImage from './../../../../assets/images/main/common/preloader.webp';
import styles from './preloader.module.scss';

const Preloader = (): JSX.Element =>
(
  <div className={styles.preloader}>
    <img src={preloaderImage} />
  </div>
);

export default Preloader;
