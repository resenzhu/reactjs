import {EffectCallback} from 'react';

export const debounce = (callback: (...args: any[]) => any, delay: number): EffectCallback => // eslint-disable-line
{
  let timer: number | NodeJS.Timeout = 0;

  return (): void =>
  {
    clearTimeout(timer);

    timer = setTimeout((): void =>
    {
      timer = 0;

      callback.apply(null);
    },
    delay);
  };
};
