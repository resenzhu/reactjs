import {AnimatePresence, motion} from 'framer-motion';
import {useApp, useTranslation} from './../../../hooks/app';
import {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {HashLink} from 'react-router-hash-link';
import {Language} from './../../../redux/reducers/app/app.types';
import ReactCountryFlag from 'react-country-flag';
import brandImage from './../../../assets/main/images/navbar.brand.webp';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {isMobile} from 'react-device-detect';
import {scrollToElement} from './../../../utils/element';
import styles from './navbar.module.scss';

type DropdownVariants =
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

type Iso = 'en' | 'id';

type Country = 'US' | 'ID';

type Languages =
{
  iso: Iso,
  country: Country
}[];

type Menus = string[];

const Navbar = (): JSX.Element =>
{
  const {i18next, translate} = useTranslation('main.layout');

  const {language, viewport, setLanguage} = useApp();

  const languageDropdown = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const menuDropdown = useRef<HTMLDivElement>(null);

  const [showLanguages, setShowLanguages] = useState<boolean>(false);

  const [showMenus, setShowMenus] = useState<boolean>(false);

  const dropdownVariants: DropdownVariants =
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
        duration: 0.15
      }
    },
    exit:
    {
      opacity: 0,
      transition:
      {
        duration: 0.15
      }
    }
  };

  const languages: Languages =
  [
    {
      iso: 'en',
      country: 'US'
    },
    {
      iso: 'id',
      country: 'ID'
    }
  ];

  const menus: Menus =
  [
    'home',
    'projects',
    'contact'
  ];

  const handleChangeLanguage = (iso: Iso): void =>
  {
    if (iso !== language)
    {
      setLanguage(iso as Language);
    }

    setShowLanguages(false);
  };

  const handleHideLanguageDropdown = (event: MouseEvent): void =>
  {
    if (languageDropdown.current && !languageDropdown.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('div')?.getAttribute('class')?.startsWith('navbar_language'))
    {
      setShowLanguages(false);
    }
  };

  const handleHideMenuDropdown = (event: MouseEvent): void =>
  {
    if (menuDropdown.current && !menuDropdown.current.contains(event.target as Node) && !(event.target as HTMLElement).closest('div')?.getAttribute('class')?.startsWith('navbar_toggler'))
    {
      setShowMenus(false);
    }
  };

  const handleScrollToSection = (el: HTMLElement): void =>
  {
    let offset: number = 50;

    if (isMobile && window.scrollY === 0)
    {
      switch (el.id)
      {
        case 'projects':
          offset = -22;
          break;

        case 'contact':
          offset = -60;
          break;

        default:
          offset = 50;
          break;
      }
    }

    scrollToElement(el, offset);
  };

  const handleToggleLanguageDropdown = (show: boolean): void =>
  {
    if (show !== showLanguages)
    {
      setShowLanguages(show);
    }
  };

  const handleToggleMenuDropdown = (show: boolean): void =>
  {
    if (show !== showMenus)
    {
      setShowMenus(show);
    }
  };

  useEffect((): () => void =>
  {
    if (!loading)
    {
      setLoading(true);
    }

    return (): void =>
    {
      window.removeEventListener('mousedown', handleHideLanguageDropdown);

      window.removeEventListener('mousedown', handleHideMenuDropdown);
    };
  },
  []);

  useEffect((): void =>
  {
    if (loading)
    {
      window.addEventListener('mousedown', handleHideLanguageDropdown);

      window.addEventListener('mousedown', handleHideMenuDropdown);

      setLoading(false);
    }
  },
  [loading]);

  useEffect((): void =>
  {
    if (language !== i18next.language)
    {
      document.documentElement.lang = language;

      i18next.changeLanguage(language);
    }
  },
  [language]);

  return (
    <div className={styles.navbar}>
      <div className={styles.brand}>
        <HashLink
          to='/#home'
          scroll={handleScrollToSection}
        >
          <img
            src={brandImage}
            width={35}
            height={35}
            alt={translate('navbar.brand.label.logo').toString()}
          />
          <span>{translate('navbar.brand.title')}</span>
        </HashLink>
      </div>
      <div className={styles.nav}>
        <div className={styles.language}>
          <ReactCountryFlag
            className={styles.selected}
            countryCode={languages.find((lang): boolean => lang.iso === language)?.country ?? languages[0].country}
            svg={true}
            alt={translate('navbar.language.label.flag').toString()}
            onClick={(): void => handleToggleLanguageDropdown(!showLanguages)}
          />
          <AnimatePresence>
            {
              showLanguages &&
              <motion.div
                className={styles.list}
                ref={languageDropdown}
                key='languages'
                variants={dropdownVariants}
                initial='initial'
                animate='animate'
                exit='exit'
              >
                {
                  languages.map((lang): JSX.Element =>
                  (
                    <div
                      className={styles.item}
                      key={lang.iso}
                      onClick={(): void => handleChangeLanguage(lang.iso)}
                    >
                      {translate(`navbar.language.${lang.iso}`)}
                    </div>
                  ))
                }
              </motion.div>
            }
          </AnimatePresence>
        </div>
        <div className={styles.menu}>
          {
            viewport.width < 576 &&
            <div
              className={styles.toggler}
              onClick={(): void => handleToggleMenuDropdown(!showMenus)}
            >
              <FontAwesomeIcon icon={faBars} />
            </div>
          }
          <AnimatePresence>
            {
              ((viewport.width < 576 && showMenus) || viewport.width >= 576) &&
              <motion.div
                className={styles.list}
                ref={menuDropdown}
                key='menus'
                variants={dropdownVariants}
                initial='initial'
                animate='animate'
                exit='exit'
              >
                {
                  menus.map((menu): JSX.Element =>
                  (
                    <div
                      className={styles.item}
                      key={menu}
                      onClick={(): void => handleToggleMenuDropdown(!showMenus)}
                    >
                      <HashLink
                        to={`/#${menu}`}
                        scroll={handleScrollToSection}
                      >
                        {translate(`navbar.menu.${menu}`)}
                      </HashLink>
                    </div>
                  ))
                }
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
