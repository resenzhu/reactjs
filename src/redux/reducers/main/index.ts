import {combineReducers} from '@reduxjs/toolkit';
import {createConfig} from './../../../utils/persist';
import homeReducer from './home';
import {persistReducer} from 'redux-persist';

const combinedReducers = combineReducers(
{
  home: persistReducer(createConfig('home'), homeReducer)
});

export default combinedReducers;
