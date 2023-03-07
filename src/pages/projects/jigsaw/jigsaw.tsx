import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import {Seo} from './../../../components/main';
import styles from './jigsaw.module.scss';
import {useTranslation} from './../../../hooks/main';

const Jigsaw = (): JSX.Element =>
{
  const {translate} = useTranslation('project.jigsaw');

  return (
    <>
      <Seo
        title={translate('seo.title')}
        description={translate('seo.description')}
      />
      <div className={styles.app}>
        <div className={styles.titlescreen}>
          <div className={styles.background}></div>
          <div className={styles.content}>
            <div className={styles.title}>
              {translate('screenTitle.title')}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jigsaw;
