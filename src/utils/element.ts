import {FocusEvent} from 'react';

export const handleBlurOnFocus = (event: FocusEvent<HTMLElement>): void =>
{
  event.target.blur();
};

export const scrollToElement = (element: HTMLElement, offset: number = 60): void =>
{
  window.scroll(
  {
    top: element.offsetTop - offset,
    behavior: 'smooth'
  });
};
