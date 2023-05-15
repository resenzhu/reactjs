import appReducer from './app/app';
import {combineReducers} from '@reduxjs/toolkit';
import {createConfig} from './../../utils/persist';
import mainReducer from './main';
import {persistReducer} from 'redux-persist';

const combinedReducers = combineReducers(
{
  app: persistReducer(createConfig('app', ['language']), appReducer),
  main: persistReducer(createConfig('main'), mainReducer)
});

export default combinedReducers;
