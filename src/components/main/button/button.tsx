import {AnimatePresence, motion} from 'framer-motion';
import {MouseEventHandler, ReactNode} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {handleBlurOnFocus} from './../../../utils/element';
import styles from './button.module.scss';

type Button =
{
  type: 'button' | 'submit' | 'reset',
  children: ReactNode,
  loading?: boolean,
  ariaLabel?: string,
  onclick?: MouseEventHandler<HTMLButtonElement>
};

type LoadingVariants =
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
  },
  exit:
  {
    opacity: number,
    transition:
    {
      duration: number
    }
  }
};

type SpinVariants =
{
  animate:
  {
    rotate: number,
    transition:
    {
      duration: number,
      repeat: number,
      repeatType: 'loop' | 'reverse' | 'mirror',
      ease: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'circIn' | 'circOut' | 'circInOut' | 'backIn' | 'backOut' | 'backInOut' | 'anticipate'
    }
  }
};

const Button = ({type, children, loading, ariaLabel, onclick}: Button): JSX.Element =>
{
  const loadingVariants: LoadingVariants =
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
        duration: 0.2
      }
    },
    exit:
    {
      opacity: 0,
      transition:
      {
        duration: 0.2
      }
    }
  };

  const spinVariants: SpinVariants =
  {
    animate:
    {
      rotate: 360,
      transition:
      {
        duration: 1.2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'linear'
      }
    }
  };

  return (
    <button
      className={`${styles.button} ${loading ? styles.loading : ''}`.trim()}
      type={type}
      aria-label={ariaLabel}
      onFocus={handleBlurOnFocus}
      onClick={onclick}
    >
      <AnimatePresence
        mode='wait'
        initial={false}
      >
        {
          !loading &&
          <motion.div
            key='children'
            variants={loadingVariants}
            initial='initial'
            animate='animate'
            exit='exit'
          >
            {children}
          </motion.div>
        }
        {
          loading &&
          <motion.div
            key='spinner'
            variants={loadingVariants}
            initial='initial'
            animate='animate'
            exit='exit'
          >
            <motion.div
              key='spin'
              variants={spinVariants}
              animate='animate'
            >
              <FontAwesomeIcon icon={faSpinner} />
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </button>
  );
};

export default Button;
