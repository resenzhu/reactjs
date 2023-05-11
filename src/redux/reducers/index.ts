import appReducer from './app';
import {combineReducers} from '@reduxjs/toolkit';
import {createConfig} from './../../utils/persist';
import mainReducer from './main';
import {persistReducer} from 'redux-persist';

const combinedReducers = combineReducers(
{
  app: persistReducer(createConfig('app'), appReducer),
  main: persistReducer(createConfig('main'), mainReducer)
});

export default combinedReducers;
