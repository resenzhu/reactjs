import {Language, Online, Ready, Viewport} from './app.types';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';

type State =
{
  viewport: Viewport,
  ready: Ready,
  online: Online,
  language: Language
};

type Reducers =
{
  setViewport: (state: State, action: PayloadAction<Viewport>) => void,
  setReady: (state: State, action: PayloadAction<Ready>) => void,
  setOnline: (state: State, action: PayloadAction<Online>) => void,
  setLanguage: (state: State, action: PayloadAction<Language>) => void
};

const name: string = 'app';

const initialState: State =
{
  viewport:
  {
    width: 0,
    height: 0
  },
  ready: false,
  online: false,
  language: 'en'
};

const reducers: Reducers =
{
  setViewport: (state, action) =>
  {
    if (JSON.stringify(state.viewport) !== JSON.stringify(action.payload))
    {
      state.viewport = action.payload;
    }
  },
  setReady: (state, action) =>
  {
    if (state.ready !== action.payload)
    {
      state.ready = action.payload;
    }
  },
  setOnline: (state, action) =>
  {
    if (state.online !== action.payload)
    {
      state.online = action.payload;
    }
  },
  setLanguage: (state, action) =>
  {
    if (state.language !== action.payload)
    {
      state.language = action.payload;
    }
  }
};

const slice = createSlice(
{
  name: name,
  initialState: initialState,
  reducers: reducers
});

export const {setViewport, setReady, setOnline, setLanguage} = slice.actions;

export default slice.reducer;
