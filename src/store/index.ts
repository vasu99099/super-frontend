import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector
} from 'react-redux';
import categorySlice from './slices/categorySlice';
import customerSlice from './slices/customerSlice';
import globalSlice from './slices/globalSlice';

const store = configureStore({
  reducer: {
    global: globalSlice,
    auth: authReducer,
    category: categorySlice,
    customer: customerSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const { dispatch } = store;

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

const useDispatch = () => useAppDispatch<AppDispatch>();

export { store, dispatch, useSelector, useDispatch };
