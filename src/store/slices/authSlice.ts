import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '..';
import api from '@/utils/axios';
import API_ROUTES from '@/constant/API_ROUTES';
import { UserLogin } from '@/types/auth';
import { ROUTE_PATH } from '@/constant/Routes';
import { logout } from '@/utils/util';

interface AuthState {
  user: {
    id: string;
    username: string;
    role_id: number;
    contact_number: string;
    email: string;
    firstname: string;
    lastname: string;
    profile_image?: string;
  } | null;
  error: { message: string | Record<string, string>; errorCode?: string } | null;
  isLoading: boolean;
}
type UserType = AuthState['user'];

const initialState: AuthState = {
  user: null,
  error: null,
  isLoading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState['user']>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
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

export const login = (payload: UserLogin) => {
  return async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.hasError(null));
    dispatch(authSlice.actions.startLoading());
    try {
      const response = await api.post(API_ROUTES.LOGIN, payload);
      if (response.status === 200) {
        dispatch(authSlice.actions.setUser(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(authSlice.actions.stopLoading());
    }
  };
};

export const fetchUserDetails = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.hasError(null));
    dispatch(authSlice.actions.startLoading());
    try {
      const { data, status } = await api.get(API_ROUTES.WHOAMI);
      if (status === 200) {
        dispatch(authSlice.actions.setUser(data.data));
      }
    } catch (error) {
      dispatch(authSlice.actions.hasError(error));
      logout();
    } finally {
      dispatch(authSlice.actions.stopLoading());
    }
  };
};
export const updateUserProfile = (payload: Partial<UserType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.hasError(null));
    dispatch(authSlice.actions.startLoading());
    try {
      const response = await api.put(API_ROUTES.UPDATE_PROFILE, payload);
      if (response.status === 201) {
        dispatch(fetchUserDetails());
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(authSlice.actions.stopLoading());
    }
  };
};

export const updateUserProfileImage = (payload: FormData) => {
  return async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.hasError(null));
    dispatch(authSlice.actions.startLoading());
    try {
      const response = await api.post(API_ROUTES.UPDATE_PROFILE_IMAGE, payload);
      if (response.status === 201) {
        dispatch(fetchUserDetails());
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(authSlice.actions.stopLoading());
    }
  };
};

export const { actions } = authSlice;
export default authSlice.reducer;
