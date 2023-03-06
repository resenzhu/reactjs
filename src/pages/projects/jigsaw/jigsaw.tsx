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
      <div className={styles.mainmenu}>
        <div className={styles.background}></div>
        <div className={styles.content}></div>
      </div>
    </>
  );
};

export default Jigsaw;
