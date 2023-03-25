import {MouseEventHandler, ReactNode} from 'react';
import styles from './button.module.scss';

type Button =
{
  type: 'button' | 'submit' | 'reset',
  children: ReactNode,
  onclick: MouseEventHandler<HTMLButtonElement>
};

const Button = ({type, children, onclick}: Button): JSX.Element =>
(
  <button
    className={styles.button}
    type={type}
    onClick={onclick}
  >
    {children}
  </button>
);

export default Button;
