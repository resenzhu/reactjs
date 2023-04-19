import * as yup from 'yup';
import {AnimatePresence, motion} from 'framer-motion';
import {Button, Form, Headline, Project, Seo, Social} from './../../../components/main';
import {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import {IconDefinition, faArrowUp, faComments, faEnvelope} from '@fortawesome/free-solid-svg-icons';
import {faGithub, faInstagram, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {useHome, useLayout, useTranslation} from './../../../hooks/main';
import {ContactForm} from './../../../redux/reducers/main/home.types';
import {DateTime} from 'luxon';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {HashLink} from 'react-router-hash-link';
import {Message} from 'yup';
import {Trans} from 'react-i18next';
import Typewriter from 'typewriter-effect';
import {generateRandomInt} from './../../../utils/number';
import {mainSocket} from './../../../utils/socket';
import profileImage from './../../../assets/images/main/home/profile.webp';
import {scrollToElement} from './../../../utils/element';
import styles from './home.module.scss';
import theLoungeImage from './../../../assets/images/main/home/the-lounge.webp';
import validator from 'validator';

type TypewriterOptions =
{
  strings: string[],
  autoStart: boolean,
  delay: number,
  pauseFor: number,
  loop: boolean
};

type ContactFormVariants =
{
  initial:
  {
    opacity: number,
    scale: number
  },
  whileInView:
  {
    opacity: number,
    scale: number,
    display: string,
    flex: number,
    transition:
    {
      duration: number
    }
  }
};

type FormInfoVariants =
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

type HeadlineVariants =
{
  initial:
  {
    opacity: number,
    marginRight: number
  },
  whileInView:
  {
    opacity: number,
    marginRight: number,
    transition:
    {
      duration: number
    }
  }
};

type Projects =
{
  key: string,
  background: string,
  icon: IconDefinition
}[];

type ProjectsListVariants =
{
  initial:
  {
    opacity: number,
    marginTop: number
  },
  whileInView:
  {
    opacity: number,
    marginTop: number,
    transition:
    {
      duration: number
    }
  }
};

type Socials =
{
  key: string,
  icon: IconDefinition,
  url: string
}[];

type ReqSubmitContactForm =
{
  name: string,
  email: string,
  message: string,
  honeypot: string
};

const Specialty = (): JSX.Element =>
{
  const typewriterOptions: TypewriterOptions =
  {
    strings:
    [
      'Full Stack Developer',
      'Front End Developer',
      'Back End Developer',
      'Middleware Developer'
    ],
    autoStart: true,
    delay: generateRandomInt(100, 120),
    pauseFor: generateRandomInt(1500, 2500),
    loop: true
  };

  return <Typewriter options={typewriterOptions} />;
};

const Copyright = (): JSX.Element => <>&#169; {DateTime.now().year}</>;

const Home = (): JSX.Element =>
{
  const {contactForm, setContactForm} = useHome();

  const [contactFormReady, setContactFormReady] = useState<boolean>(false);

  const {language, online, viewport} = useLayout();

  const [loading, setLoading] = useState<boolean>(false);

  const [profileImageSize, setProfileImageSize] = useState<number>(0);

  const {translate} = useTranslation('main.home');

  const contactFormSchema = yup.object().shape(
  {
    name: yup.string().ensure().required(translate('contact.form.name.error.empty') as Message).min(2, translate('contact.form.name.error.tooShort') as Message).max(120, translate('contact.form.name.error.tooLong') as Message),
    email: yup.string().ensure().required(translate('contact.form.email.error.empty') as Message).min(3, translate('contact.form.email.error.tooShort') as Message).max(320, translate('contact.form.email.error.tooLong') as Message),
    message: yup.string().ensure().required(translate('contact.form.message.error.empty') as Message).min(15, translate('contact.form.message.error.tooShort') as Message).max(2000, translate('contact.form.message.error.tooLong') as Message)
  });

  const contactFormVariants: ContactFormVariants =
  {
    initial:
    {
      opacity: 0,
      scale: 0.5
    },
    whileInView:
    {
      opacity: 1,
      scale: 1,
      display: 'grid',
      flex: 1,
      transition:
      {
        duration: 0.6
      }
    }
  };

  const formInfoVariants: FormInfoVariants =
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

  const headlineVariants: HeadlineVariants =
  {
    initial:
    {
      opacity: 0,
      marginRight: 200
    },
    whileInView:
    {
      opacity: 1,
      marginRight: 0,
      transition:
      {
        duration: 0.6
      }
    }
  };

  const projects: Projects =
  [
    {
      key: 'theLounge',
      background: theLoungeImage,
      icon: faComments
    }
  ];

  const projectsListVariants: ProjectsListVariants =
  {
    initial:
    {
      opacity: 0,
      marginTop: 200
    },
    whileInView:
    {
      opacity: 1,
      marginTop: 0,
      transition:
      {
        duration: 0.6
      }
    }
  };

  const socials: Socials =
  [
    {
      key: 'linkedin',
      icon: faLinkedin,
      url: 'https://linkedin.com/in/resen'
    },
    {
      key: 'github',
      icon: faGithub,
      url: 'https://github.com/resenzhu'
    },
    {
      key: 'instagram',
      icon: faInstagram,
      url: 'https://instagram.com/resenzhu'
    },
    {
      key: 'email',
      icon: faEnvelope,
      url: 'mailto:resen.zhu@gmail.com'
    }
  ];

  const handleScrollToSection = (el: HTMLElement): void =>
  {
    scrollToElement(el);
  };

  const handleScrollToTop = (): void =>
  {
    window.scrollTo(0, 0);
  };

  const validateContactForm = (): Promise<void> =>
  (
    new Promise((resolve, reject): void =>
    {
      contactFormSchema.validate(contactForm,
      {
        strict: true,
        abortEarly: false
      })
      .then((): void =>
      {
        if (!validator.isAlpha(contactForm.name, 'en-US', {ignore: ' '}))
        {
          reject(translate('contact.form.name.error.invalid'));
        }

        if (!validator.isEmail(contactForm.email))
        {
          reject(translate('contact.form.email.error.invalid'));
        }

        if (!contactFormReady)
        {
          reject(translate('contact.form.error.tooFast'));
        }

        if (!online)
        {
          reject(translate('contact.form.error.offline'));
        }

        resolve();
      })
      .catch((err): void =>
      {
        reject(err.errors[0]);
      });
    })
  );

  const handleSubmitContactForm = (event: MouseEvent<HTMLButtonElement>): void =>
  {
    event.preventDefault();

    if (contactForm.phone.length === 0 && !contactForm.submitting)
    {
      validateContactForm().then((): void =>
      {
        const updatedContactForm: ContactForm =
        {
          ...contactForm,
          submitting: true,
          error: '',
          success: ''
        };

        setContactForm(updatedContactForm);
      })
      .catch((err): void =>
      {
        const updatedContactForm: ContactForm =
        {
          ...contactForm,
          error: err,
          success: ''
        };

        setContactForm(updatedContactForm);
      });
    }
  };

  const handleTrimContactForm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
  {
    const property = event.target.name as keyof ContactForm;

    const {value} = event.target;

    if (contactForm[property] !== value)
    {
      const updatedContactForm: ContactForm =
      {
        ...contactForm,
        [property]: value.trim()
      };

      setContactForm(updatedContactForm);
    }
  };

  const handleUpdateContactForm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
  {
    const property = event.target.name as keyof ContactForm;

    const {value} = event.target;

    if (contactForm[property] !== value)
    {
      const updatedContactForm: ContactForm =
      {
        ...contactForm,
        [property]: value,
        error: '',
        success: ''
      };

      setContactForm(updatedContactForm);
    }
  };

  const submitContactForm = (): Promise<string> =>
  (
    new Promise((resolve, reject): void =>
    {
      if (mainSocket.connected)
      {
        const reqSubmitContactForm: ReqSubmitContactForm =
        {
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          honeypot: contactForm.phone
        };

        mainSocket.emit('submit-contact-form', reqSubmitContactForm);
      }

      mainSocket.once('submit-contact-form-response', (response): void =>
      {
        if (response.success)
        {
          resolve(translate('contact.form.success').toString());
        }
        else
        {
          let err: string = '';

          if (response.error.status === 400)
          {
            switch (response.error.subStatus)
            {
              case 101:
              case 102:
              case 106:
                err = translate('contact.form.name.error.empty');
                break;

              case 103:
                err = translate('contact.form.name.error.tooShort');
                break;

              case 104:
                err = translate('contact.form.name.error.tooLong');
                break;

              case 105:
                err = translate('contact.form.name.error.invalid');
                break;

              case 201:
              case 202:
              case 206:
                err = translate('contact.form.email.error.empty');
                break;

              case 203:
                err = translate('contact.form.email.error.tooShort');
                break;

              case 204:
                err = translate('contact.form.email.error.tooLong');
                break;

              case 205:
                err = translate('contact.form.email.error.invalid');
                break;

              case 301:
              case 302:
              case 305:
                err = translate('contact.form.message.error.empty');
                break;

              case 303:
                err = translate('contact.form.message.error.tooShort');
                break;

              case 304:
                err = translate('contact.form.message.error.tooLong');
                break;

              default:
                err = '';
                break;
            }
          }

          if (response.error.status === 503)
          {
            err = translate('contact.form.error.server');
          }

          reject(err);
        }
      });

      setTimeout((): void =>
      {
        mainSocket.off('submit-contact-form-response');

        reject(new Error(translate('contact.form.error.server').toString()).message);
      },
      5000);
    })
  );

  useEffect((): () => void =>
  {
    if (!loading)
    {
      setLoading(true);
    }

    return (): void =>
    {
      mainSocket.removeAllListeners();

      mainSocket.disconnect();
    };
  },
  []);

  useEffect((): void =>
  {
    if (loading)
    {
      if (!mainSocket.connected)
      {
        mainSocket.connect();
      }

      setTimeout((): void =>
      {
        setContactFormReady(true);
      },
      3000);

      setLoading(false);
    }
  },
  [loading]);

  useEffect((): void =>
  {
    if (contactForm.error.length !== 0 || contactForm.success.length !== 0)
    {
      const updatedContactForm: ContactForm =
      {
        ...contactForm,
        error: '',
        success: ''
      };

      setContactForm(updatedContactForm);
    }
  },
  [language]);

  useEffect((): void =>
  {
    if (contactForm.submitting)
    {
      submitContactForm().then((success): void =>
      {
        const updatedContactForm: ContactForm =
        {
          ...contactForm,
          submitting: false,
          error: '',
          success: success
        };

        setContactForm(updatedContactForm);
      })
      .catch((err): void =>
      {
        const updatedContactForm: ContactForm =
        {
          ...contactForm,
          submitting: false,
          error: err,
          success: ''
        };

        setContactForm(updatedContactForm);
      });
    }
  },
  [contactForm.submitting]);

  useEffect((): void =>
  {
    let size: number = 0;

    if (viewport.width < 576)
    {
      size = 120;
    }

    if (viewport.width >= 576 && viewport.width < 768)
    {
      size = 130;
    }

    if (viewport.width >= 768 && viewport.width < 992)
    {
      size = 140;
    }

    if (viewport.width >= 992 && viewport.width < 1200)
    {
      size = 150;
    }

    if (viewport.width >= 1200)
    {
      size = 160;
    }

    if (size !== profileImageSize)
    {
      setProfileImageSize(size);
    }
  },
  [viewport]);

  return (
    <>
      <Seo
        title={translate('seo.title')}
        description={translate('seo.description')}
      />
      <section
        className={styles.hero}
        id='home'
      >
        <div className={styles.content}>
          <div className={styles.profile}>
            <img
              src={profileImage}
              width={profileImageSize}
              height={profileImageSize}
              alt={translate('hero.label.photo').toString()}
            />
          </div>
          <div className={styles.name}>
            <Trans
              i18nKey='main.home:hero.name'
              components={{span: <span />}}
            />
          </div>
          <div className={styles.specialty}>
            <Trans
              i18nKey='main.home:hero.specialty'
              components={{specialty: <Specialty />}}
            />
          </div>
          <div className={styles.work}>
            <HashLink
              to='/#projects'
              scroll={handleScrollToSection}
            >
              <Button type='button'>
                {translate('hero.work')}
              </Button>
            </HashLink>
          </div>
        </div>
      </section>
      <section
        className={styles.projects}
        id='projects'
      >
        <motion.div
          variants={headlineVariants}
          initial='initial'
          whileInView='whileInView'
          viewport={{once: true, amount: 'all'}}
        >
          <div className={styles.headline}>
            <Headline>
              {translate('projects.headline')}
            </Headline>
          </div>
        </motion.div>
        <motion.div
          variants={projectsListVariants}
          initial='initial'
          whileInView='whileInView'
          viewport={{once: true}}
        >
          <div className={styles.list}>
            {
              projects.map((project): JSX.Element =>
              (
                <Project
                  key={project.key}
                  background={project.background}
                  icon={project.icon}
                  name={translate(`projects.list.${project.key}.name`)}
                  slogan={translate(`projects.list.${project.key}.slogan`)}
                  url={`/project/${project.key.replace(/([A-Z])/gu, '-$1').toLowerCase()}`}
                />
              ))
            }
          </div>
        </motion.div>
      </section>
      <section
        className={styles.contact}
        id='contact'
      >
        <motion.div
          variants={headlineVariants}
          initial='initial'
          whileInView='whileInView'
          viewport={{once: true, amount: 'all'}}
        >
          <div className={styles.headline}>
            <Headline>
              {translate('contact.headline')}
            </Headline>
          </div>
        </motion.div>
        <motion.div
          variants={contactFormVariants}
          initial='initial'
          whileInView='whileInView'
          viewport={{once: true}}
        >
          <div className={styles.form}>
            <Form>
              <Form.Input
                name='name'
                type='text'
                placeholder={translate('contact.form.name.placeholder')}
                value={contactForm.name}
                onchange={handleUpdateContactForm}
                onblur={handleTrimContactForm}
              />
              <Form.Input
                name='email'
                type='text'
                placeholder={translate('contact.form.email.placeholder')}
                value={contactForm.email}
                onchange={handleUpdateContactForm}
                onblur={handleTrimContactForm}
              />
              <Form.TextArea
                name='message'
                placeholder={translate('contact.form.message.placeholder')}
                value={contactForm.message}
                onchange={handleUpdateContactForm}
                onblur={handleTrimContactForm}
              />
              <Form.Input
                name='phone'
                type='text'
                placeholder={translate('contact.form.phone.placeholder')}
                value={contactForm.phone}
                onchange={handleUpdateContactForm}
                onblur={handleTrimContactForm}
              />
              <AnimatePresence mode='popLayout'>
                {
                  contactForm.error.length !== 0 &&
                  <motion.div
                    key='error'
                    variants={formInfoVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                  >
                    <Form.Error>
                      {contactForm.error}
                    </Form.Error>
                  </motion.div>
                }
                {
                  contactForm.success.length !== 0 &&
                  <motion.div
                    key='success'
                    variants={formInfoVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                  >
                    <Form.Success>
                      {contactForm.success}
                    </Form.Success>
                  </motion.div>
                }
              </AnimatePresence>
              <Button
                type='button'
                loading={contactForm.submitting}
                onclick={handleSubmitContactForm}
              >
                {translate('contact.form.submit')}
              </Button>
            </Form>
          </div>
        </motion.div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.scrollback}>
          <Button
            type='button'
            ariaLabel={translate('footer.label.scrollToTop').toString()}
            onclick={handleScrollToTop}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </Button>
        </div>
        <div className={styles.social}>
          {
            socials.map((social): JSX.Element =>
            (
              <Social
                key={social.key}
                icon={social.icon}
                url={social.url}
                ariaLabel={social.key}
              />
            ))
          }
        </div>
        <div className={styles.copyright}>
          <Trans
            i18nKey='main.home:footer.copyright'
            components={{copyright: <Copyright />}}
          />
        </div>
      </footer>
    </>
  );
};

export default Home;
