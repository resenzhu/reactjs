import {ChangeEventHandler, FocusEventHandler, HTMLInputTypeAttribute, ReactNode} from 'react';
import styles from './form.module.scss';

type Form =
{
  children: ReactNode
};

type Error =
{
  children: string
};

type Input =
{
  name: string,
  type: HTMLInputTypeAttribute,
  placeholder: string,
  value: string | number | readonly string[],
  onchange: ChangeEventHandler<HTMLInputElement>,
  onblur?: FocusEventHandler<HTMLInputElement>
};

type Success =
{
  children: string
};

type TextArea =
{
  name: string,
  placeholder: string,
  value: string | number | readonly string[],
  onchange: ChangeEventHandler<HTMLTextAreaElement>,
  onblur?: FocusEventHandler<HTMLTextAreaElement>
};

const Form = ({children}: Form): JSX.Element =>
(
  <form
    className={styles.form}
    autoComplete='off'
  >
    {children}
  </form>
);

const Error = ({children}: Error): JSX.Element =>
(
  <div className={styles.error}>
    {children}
  </div>
);

const Input = ({name, type, placeholder, value, onchange, onblur}: Input): JSX.Element =>
(
  <input
    className={styles.input}
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onchange}
    onBlur={onblur}
  />
);

const Success = ({children}: Success): JSX.Element =>
(
  <div className={styles.success}>
    {children}
  </div>
);

const TextArea = ({name, placeholder, value, onchange, onblur}: TextArea): JSX.Element =>
(
  <textarea
    className={styles.textarea}
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onchange}
    onBlur={onblur}
  >
  </textarea>
);

Form.Error = Error;
Form.Input = Input;
Form.Success = Success;
Form.TextArea = TextArea;

export default Form;
