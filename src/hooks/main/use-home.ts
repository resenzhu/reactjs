import {useDispatch, useSelector} from './../../redux/hooks';
import {ContactForm} from './../../redux/reducers/main/home.types';
import {setContactForm as setHomeContactForm} from './../../redux/reducers/main/home';

type UseHome =
{
  contactForm: ContactForm,
  setContactForm: (contactForm: ContactForm) => void
};

const useHome = (): UseHome =>
{
  const dispatch = useDispatch();

  const setContactForm = (contactForm: ContactForm): void =>
  {
    dispatch(setHomeContactForm(contactForm));
  };

  return {
    contactForm: useSelector((state) => state.main.home.contactForm),
    setContactForm: setContactForm
  };
};

export default useHome;
