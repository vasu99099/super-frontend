import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '..';
import api from '@/utils/axios';
import API_ROUTES from '@/constant/API_ROUTES';

interface GlobalState {
  village: { options: { value: string; label: string }[]; isLoading: boolean };
  error: { message: string | Record<string, string>; errorCode?: string } | null;
  isLoading: boolean;
}

const initialState: GlobalState = {
  village: { isLoading: false, options: [] },
  error: null,
  isLoading: false
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setVillageOptions: (state, action: PayloadAction<GlobalState['village']['options']>) => {
      state.village.options = action.payload;
      state.village.isLoading = false;
    },

    hasError(state, action) {
      state.error = action.payload;
    },
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    startVillageLoading(state) {
      state.village.isLoading = true;
    },
    stopVillageLoading(state) {
      state.village.isLoading = false;
    }
  }
});

export const getVillageList = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(globalSlice.actions.startVillageLoading());
    try {
      const { data, status } = await api.get(API_ROUTES.VILLAGE.GET_VILLAGE);
      if (status === 200) {
        dispatch(globalSlice.actions.setVillageOptions(data.data));
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(globalSlice.actions.stopVillageLoading());
    }
  };
};

export const { actions } = globalSlice;
export default globalSlice.reducer;
