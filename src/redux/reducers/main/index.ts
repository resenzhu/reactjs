import {combineReducers} from '@reduxjs/toolkit';
import {createConfig} from './../../../utils/persist';
import homeReducer from './home';
import layoutReducer from './layout';
import {persistReducer} from 'redux-persist';

const combinedReducers = combineReducers(
{
  layout: persistReducer(createConfig('layout', ['language']), layoutReducer),
  home: persistReducer(createConfig('home'), homeReducer)
});

export default combinedReducers;
