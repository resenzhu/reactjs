import {combineReducers} from '@reduxjs/toolkit';
import {createConfig} from './../../utils/persist';
import mainReducer from './main';
import {persistReducer} from 'redux-persist';

const combinedReducers = combineReducers(
{
  main: persistReducer(createConfig('main'), mainReducer)
});

export default combinedReducers;
