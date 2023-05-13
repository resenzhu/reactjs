import preloaderImage from './../../../assets/main/images/layout.preloader.webp';
import styles from './preloader.module.scss';

const Preloader = (): JSX.Element =>
(
  <div className={styles.preloader}>
    <img src={preloaderImage} />
  </div>
);

export default Preloader;
