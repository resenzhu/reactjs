import type {AppDispatch, RootState} from './store';
import {TypedUseSelectorHook, useDispatch as useAppDispatch, useSelector as useAppSelector} from 'react-redux';

export const useDispatch: () => AppDispatch = useAppDispatch;

export const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;
