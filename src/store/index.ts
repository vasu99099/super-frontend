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
import dashboardSlice from './slices/dashboardSlice';
import productSlice from './slices/productSlice';
import dosageSlice from './slices/dosageSlice';

const store = configureStore({
  reducer: {
    global: globalSlice,
    auth: authReducer,
    dashboard: dashboardSlice,
    category: categorySlice,
    customer: customerSlice,
    product: productSlice,
    dosage: dosageSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const { dispatch } = store;

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

const useDispatch = () => useAppDispatch<AppDispatch>();

export { store, dispatch, useSelector, useDispatch };
