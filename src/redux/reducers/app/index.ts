import appReducer from './app';
import {combineReducers} from '@reduxjs/toolkit';
import {createConfig} from './../../../utils/persist';
import {persistReducer} from 'redux-persist';

const combinedReducers = combineReducers(
{
  app: persistReducer(createConfig('app', ['language']), appReducer)
});

export default combinedReducers;
