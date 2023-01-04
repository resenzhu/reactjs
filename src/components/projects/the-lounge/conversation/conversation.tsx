import {AnimatePresence, motion} from 'framer-motion';
import {faRotateRight, faTrash, faWifi} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {ReactNode} from 'react';
import {sanitize} from 'dompurify';
import styles from './conversation.module.scss';

type Conversation =
{
  children: ReactNode
};

type Chat =
{
  type: 'firstPerson' | 'thirdPerson',
  header: boolean,
  username: string,
  message: string,
  time: string,
  status: 'sending' | 'pending' | 'sent',
  onretry: (...args: any[]) => any, // eslint-disable-line
  ondelete: (...args: any[]) => any // eslint-disable-line
};

type SendingVariants =
{
  initial:
  {
    opacity: number,
  },
  animate:
  {
    opacity: number,
    transition:
    {
      duration: number,
      repeat: number,
      repeatType: 'loop' | 'reverse' | 'mirror',
      ease: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'circIn' | 'circOut' | 'circInOut' | 'backIn' | 'backOut' | 'backInOut' | 'anticipate'
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
}

type PendingVariants =
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

type Info =
{
  message: string,
  time?: string
};

const Conversation = ({children}: Conversation): JSX.Element =>
(
  <div className={styles.conversation}>
    {children}
  </div>
);

const Chat = ({type, header, username, message, time, status, onretry, ondelete}: Chat): JSX.Element =>
{
  const sendingVariants: SendingVariants =
  {
    initial:
    {
      opacity: 0.5
    },
    animate:
    {
      opacity: 1,
      transition:
      {
        duration: 1.2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    },
    exit:
    {
      opacity: 0,
      transition:
      {
        duration: 0.3
      }
    }
  };

  const pendingVariants: PendingVariants =
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
    },
    exit:
    {
      opacity: 0,
      transition:
      {
        duration: 0.3
      }
    }
  };

  return (
    <div className={styles.chat}>
      <div className={styles[type]}>
        <div className={styles.box}>
          {
            type === 'thirdPerson' && header &&
            <div className={styles.header}>
              <div className={styles.username}>
                {username}
              </div>
            </div>
          }
          <div className={styles.content}>
            <div
              className={styles.message}
              dangerouslySetInnerHTML={{__html: sanitize(message)}}>
            </div>
            <div className={styles.time}>
              {time}
            </div>
          </div>
        </div>
        <div className={styles.menu}>
          <AnimatePresence mode='wait'>
            {
              status === 'sending' &&
              <motion.div
                className={styles.sending}
                key='sending'
                variants={sendingVariants}
                initial='initial'
                animate='animate'
                exit='exit'
              >
                <FontAwesomeIcon icon={faWifi} />
              </motion.div>
            }
            {
              status === 'pending' &&
              <motion.div
                className={styles.pending}
                key='pending'
                variants={pendingVariants}
                initial='initial'
                animate='animate'
                exit='exit'
              >
                <button onClick={onretry}>
                  <FontAwesomeIcon icon={faRotateRight} />
                </button>
                <button onClick={ondelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Info = ({message, time}: Info): JSX.Element =>
(
  <div className={styles.info}>
    <div className={styles.box}>
      <div className={styles.message}>
        {message}
      </div>
      {
        time &&
        <div className={styles.time}>
          {time}
        </div>
      }
    </div>
  </div>
);

Conversation.Chat = Chat;
Conversation.Info = Info;

export default Conversation;
