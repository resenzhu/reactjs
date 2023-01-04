import {combineReducers} from '@reduxjs/toolkit';
import {createConfig} from './../../utils/persist';
import mainReducer from './main';
import {persistReducer} from 'redux-persist';
import theLoungeReducer from './projects/the-lounge';

const combinedReducers = combineReducers(
{
  main: persistReducer(createConfig('main'), mainReducer),
  theLounge: persistReducer(createConfig('theLounge', ['token', 'users', 'conversations']), theLoungeReducer)
});

export default combinedReducers;
