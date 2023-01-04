import {Middleware, MiddlewareArray, configureStore} from '@reduxjs/toolkit';
import {CurriedGetDefaultMiddleware} from '@reduxjs/toolkit/dist/getDefaultMiddleware';
import {createConfig} from './../utils/persist';
import {persistReducer} from 'redux-persist';
import reducers from './reducers';

const persistedReducer = persistReducer(createConfig('root'), reducers);

const middleware = (getDefaultMiddleware: CurriedGetDefaultMiddleware): MiddlewareArray<Middleware[]> => getDefaultMiddleware(
{
  serializableCheck:
  {
    ignoreActions: true
  }
});

const store = configureStore(
{
  reducer: persistedReducer,
  middleware: middleware,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
