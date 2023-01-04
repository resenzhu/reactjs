import {ChangeEventHandler, KeyboardEvent, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {handleBlurOnFocus} from './../../../../utils/element';
import styles from './sender.module.scss';

type Sender =
{
  placeholder: string,
  value: string | number | readonly string[],
  disabled: boolean,
  onchange: ChangeEventHandler<HTMLTextAreaElement>,
  onsubmit: (...args: any[]) => any, // eslint-disable-line
  onenter?: (...args: any[]) => any, // eslint-disable-line
  onaltenter?: (...args: any[]) => any, // eslint-disable-line
};

const Sender = ({placeholder, value, disabled, onchange, onsubmit, onenter, onaltenter}: Sender): JSX.Element =>
{
  const messageInput = useRef<HTMLTextAreaElement>(null);

  const handleBindKeys = (event: KeyboardEvent<HTMLTextAreaElement>): void =>
  {
    if (!event.altKey && event.key === 'Enter' && onenter)
    {
      event.preventDefault();

      onenter();
    }

    if (event.altKey && event.key === 'Enter' && onaltenter)
    {
      event.preventDefault();

      if (messageInput.current)
      {
        messageInput.current.scrollTop = messageInput.current.scrollHeight;
      }

      onaltenter();
    }
  };

  return (
    <form
      className={styles.sender}
      autoComplete='off'
      onSubmit={onsubmit}
    >
      <textarea
        className={styles.message}
        ref={messageInput}
        placeholder={placeholder}
        value={value}
        rows={1}
        onKeyDown={handleBindKeys}
        onChange={onchange}
      >
      </textarea>
      <button
        className={styles.send}
        type='submit'
        disabled={disabled}
        onFocus={handleBlurOnFocus}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </button>
    </form>
  );
};

export default Sender;
