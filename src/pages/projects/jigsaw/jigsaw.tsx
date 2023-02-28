import 'react-jigsaw-puzzle/lib/jigsaw-puzzle.css';
import {Seo} from './../../../components/main';
import {useTranslation} from './../../../hooks/main';

const Jigsaw = (): JSX.Element =>
{
  const {translate} = useTranslation('project.jigsaw');

  return (
    <Seo
      title={translate('seo.title')}
      description={translate('seo.description')}
    />
  );
};

export default Jigsaw;
