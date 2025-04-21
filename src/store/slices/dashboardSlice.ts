import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '..';
import api from '@/utils/axios';
import API_ROUTES from '@/constant/API_ROUTES';

interface DashboardState {
  data: {
    totalCustomers: number;
    monthNewCustomers: number;
  };
  error: { message: string | Record<string, string>; errorCode?: string } | null;
  isLoading: boolean;
}
// type UserType = AuthState['user'];

const initialState: DashboardState = {
  data: { totalCustomers: 0, monthNewCustomers: 0 },
  error: null,
  isLoading: false
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData: (state, action: PayloadAction<DashboardState['data']>) => {
      state.data = action.payload;
    },

    hasError(state, action) {
      state.error = action.payload;
    },
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    }
  }
});

export const getDashboardData = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(dashboardSlice.actions.hasError(null));
    dispatch(dashboardSlice.actions.startLoading());
    try {
      const response = await api.get(API_ROUTES.DASHBOARD);

      if (response.status === 200) {
        dispatch(dashboardSlice.actions.setDashboardData(response.data.data));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(dashboardSlice.actions.stopLoading());
    }
  };
};

export const { actions } = dashboardSlice;
export default dashboardSlice.reducer;
