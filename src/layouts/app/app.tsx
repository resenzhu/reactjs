import {AnimatePresence, motion} from 'framer-motion';
import {ReactNode, useEffect, useState} from 'react';
import {useApp, useTranslation} from './../../hooks/app';
import Preloader from './preloader/preloader';
import {Viewport} from './../../redux/reducers/app/app.types';
import {debounce} from './../../utils/timer';

type App =
{
  children: ReactNode
};

type ContentVariants =
{
  initial:
  {
    opacity: number
  },
  animate:
  {
    opacity: number,
    transition:
    {
      duration: number
    }
  }
};

type PreloaderVariants =
{
  exit:
  {
    opacity: number,
    transition:
    {
      duration: number
    }
  }
};

const App = ({children}: App): JSX.Element =>
{
  const {i18next} = useTranslation();

  const {language, ready, viewport, setOnline, setReady, setViewport} = useApp();

  const [loading, setLoading] = useState<boolean>(false);

  const contentVariants: ContentVariants =
  {
    initial:
    {
      opacity: 0
    },
    animate:
    {
      opacity: 1,
      transition:
      {
        duration: 0.3
      }
    }
  };

  const preloaderVariants: PreloaderVariants =
  {
    exit:
    {
      opacity: 0,
      transition:
      {
        duration: 0.3
      }
    }
  };

  const handleChangeConnectivity = (): void =>
  {
    setOnline(navigator.onLine);
  };

  const handleResizeViewport = debounce((): void =>
  {
    const newViewport: Viewport =
    {
      width: window.innerWidth,
      height: window.innerHeight
    };

    setViewport(newViewport);
  },
  500);

  useEffect((): () => void =>
  {
    if (!loading && !ready)
    {
      setLoading(true);
    }

    return (): void =>
    {
      window.removeEventListener('offline', handleChangeConnectivity);

      window.removeEventListener('online', handleChangeConnectivity);

      window.removeEventListener('resize', handleResizeViewport);
    };
  },
  []);

  useEffect((): void =>
  {
    if (loading)
    {
      if (window.location.href.includes('#'))
      {
        history.pushState({}, document.title, `${window.location.pathname}${window.location.search}`);
      }

      if (viewport.width !== window.innerWidth || viewport.height !== window.innerHeight)
      {
        const newViewport: Viewport =
        {
          width: window.innerWidth,
          height: window.innerHeight
        };

        setViewport(newViewport);
      }

      setOnline(navigator.onLine);

      document.documentElement.lang = language;

      i18next.changeLanguage(language);

      window.addEventListener('offline', handleChangeConnectivity);

      window.addEventListener('online', handleChangeConnectivity);

      window.addEventListener('resize', handleResizeViewport);

      setLoading(false);
    }
    else
    {
      if (viewport.width !== 0 && viewport.height !== 0)
      {
        setReady(true);
      }
    }
  },
  [loading]);

  return (
    <AnimatePresence mode='wait'>
      {
        !ready &&
        <motion.div
          key='preloader'
          variants={preloaderVariants}
          exit='exit'
        >
          <Preloader />
        </motion.div>
      }
      {
        ready &&
        <motion.div
          key='content'
          variants={contentVariants}
          initial='initial'
          animate='animate'
        >
          {children}
        </motion.div>
      }
    </AnimatePresence>
  );
};

export default App;
