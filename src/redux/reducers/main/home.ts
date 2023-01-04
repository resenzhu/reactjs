import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {ContactForm} from './home.types';

type State =
{
  contactForm: ContactForm
};

type Reducers =
{
  setContactForm: (state: State, action: PayloadAction<ContactForm>) => void
};

const name: string = 'home';

const initialState: State =
{
  contactForm:
  {
    name: '',
    email: '',
    message: '',
    phone: '',
    error: '',
    submitting: false,
    success: ''
  }
};

const reducers: Reducers =
{
  setContactForm: (state, action) =>
  {
    if (JSON.stringify(state.contactForm) !== JSON.stringify(action.payload))
    {
      state.contactForm = action.payload;
    }
  }
};

const slice = createSlice(
{
  name: name,
  initialState: initialState,
  reducers: reducers
});

export const {setContactForm} = slice.actions;

export default slice.reducer;
