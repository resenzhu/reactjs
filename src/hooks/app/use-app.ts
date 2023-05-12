import {Language, Online, Ready, Viewport} from './../../redux/reducers/app/app.types';
import {setLanguage as setAppLanguage, setOnline as setAppOnline, setReady as setAppReady, setViewport as setAppViewport} from './../../redux/reducers/app/app';
import {useDispatch, useSelector} from './../../redux/hooks';

type UseApp =
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

const useApp = (): UseApp =>
{
  const dispatch = useDispatch();

  const setViewport = (viewport: Viewport): void =>
  {
    dispatch(setAppViewport(viewport));
  };

  const setReady = (ready: Ready): void =>
  {
    dispatch(setAppReady(ready));
  };

  const setOnline = (online: Online): void =>
  {
    dispatch(setAppOnline(online));
  };

  const setLanguage = (language: Language): void =>
  {
    dispatch(setAppLanguage(language));
  };

  return {
    viewport: useSelector((state) => state.app.viewport),
    ready: useSelector((state) => state.app.ready),
    online: useSelector((state) => state.app.online),
    language: useSelector((state) => state.app.language),
    setViewport: setViewport,
    setReady: setReady,
    setOnline: setOnline,
    setLanguage: setLanguage
  };
};

export default useApp;
