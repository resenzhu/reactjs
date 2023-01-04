import {Language, Online, Ready, Viewport} from './../../redux/reducers/main/layout.types';
import {setLanguage as setLayoutLanguage, setOnline as setLayoutOnline, setReady as setLayoutReady, setViewport as setLayoutViewport} from './../../redux/reducers/main/layout';
import {useDispatch, useSelector} from './../../redux/hooks';

type UseLayout =
{
  viewport: Viewport,
  ready: Ready,
  online: Online,
  language: Language,
  setViewport: (viewport: Viewport) => void,
  setReady: (ready: Ready) => void,
  setOnline: (online: Online) => void,
  setLanguage: (language: Language) => void
};

const useLayout = (): UseLayout =>
{
  const dispatch = useDispatch();

  const setViewport = (viewport: Viewport): void =>
  {
    dispatch(setLayoutViewport(viewport));
  };

  const setReady = (ready: Ready): void =>
  {
    dispatch(setLayoutReady(ready));
  };

  const setOnline = (online: Online): void =>
  {
    dispatch(setLayoutOnline(online));
  };

  const setLanguage = (language: Language): void =>
  {
    dispatch(setLayoutLanguage(language));
  };

  return {
    viewport: useSelector((state) => state.main.layout.viewport),
    ready: useSelector((state) => state.main.layout.ready),
    online: useSelector((state) => state.main.layout.online),
    language: useSelector((state) => state.main.layout.language),
    setViewport: setViewport,
    setReady: setReady,
    setOnline: setOnline,
    setLanguage: setLanguage
  };
};

export default useLayout;
