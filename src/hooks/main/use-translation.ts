import {TFunction, i18n} from 'i18next';
import {useTranslation as useReactTranslation} from 'react-i18next';

type UseTranslation =
{
  i18next: i18n,
  translate: TFunction
};

const useTranslation = (namespace?: string | string[]): UseTranslation =>
{
  const {i18n: i18next, t: translate} = useReactTranslation(namespace);

  return {
    i18next: i18next,
    translate: translate
  };
};

export default useTranslation;
