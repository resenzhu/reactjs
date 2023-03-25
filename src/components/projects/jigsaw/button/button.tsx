import {MouseEventHandler, ReactNode} from 'react';
import styles from './button.module.scss';

type Button =
{
  children: ReactNode,
  onclick: MouseEventHandler<HTMLButtonElement>
};

const Button = ({children, onclick}: Button): JSX.Element =>
(
  <button
    className={styles.button}
    onClick={onclick}
  >
    {children}
  </button>
);

export default Button;
