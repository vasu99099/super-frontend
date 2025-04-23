import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '..';
import api from '@/utils/axios';
import API_ROUTES from '@/constant/API_ROUTES';
import { customerType, FarmType } from '@/types/customerType';
import { toast } from 'react-toastify';

interface CustomerState {
  customers: customerType[];
  totalCustomers: number;
  singleActionCus: customerType | null;
  error: { message: string | Record<string, string>; errorCode?: string } | null;
  isLoading: boolean;
}

const initialState: CustomerState = {
  customers: [],
  totalCustomers: 0,
  singleActionCus: null,
  error: null,
  isLoading: false
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (
      state,
      action: PayloadAction<{ customers: CustomerState['customers']; totalRecords: number }>
    ) => {
      state.customers = action.payload.customers;
      state.totalCustomers = action.payload.totalRecords;
    },
    setCustomerById: (state, action: PayloadAction<customerType>) => {
      console.log('action.payload', action.payload);
      state.singleActionCus = action.payload;
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

export const getCustomers = (
  page = 1,
  order = 'desc',
  orderBy = '',
  pageSize = 10,
  searchText = '',
  abortSignal?: AbortSignal
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(customerSlice.actions.hasError(null));
    dispatch(customerSlice.actions.startLoading());
    try {
      const response = await api.get(
        `${API_ROUTES.CUSTOMER.GET_CUSTOMER}?page=${page}&order_by=${orderBy}&order=${order}&page_size=${pageSize}&search=${searchText}`,
        { signal: abortSignal }
      );

      if (response.status === 200) {
        dispatch(customerSlice.actions.setCustomer(response.data.data));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(customerSlice.actions.stopLoading());
    }
  };
};
export const getCustomersById = (id: string | number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(customerSlice.actions.hasError(null));
    dispatch(customerSlice.actions.startLoading());
    try {
      const response = await api.get(`${API_ROUTES.CUSTOMER.GET_CUSTOMER}?customer_id=${id}`);

      if (response.status === 200) {
        dispatch(customerSlice.actions.setCustomerById(response.data.data));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(customerSlice.actions.stopLoading());
    }
  };
};

export const updateCustomer = (payload: Partial<customerType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(customerSlice.actions.hasError(null));
    try {
      const response = await api.put(API_ROUTES.CUSTOMER.UPDATE_CUSTOMER, payload);
      if (response.status === 201 || response.status === 200) {
        dispatch(getCustomers());
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};
export const deleteCustomer = (payload: Partial<customerType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(customerSlice.actions.hasError(null)); // Reset error state
    try {
      const response = await api.delete(API_ROUTES.CUSTOMER.DELETE_CUSTOMER, { data: payload });

      if (response.status === 200 || response.status === 204) {
        toast.success('Customer deleted successfully');
        await dispatch(getCustomers());
      } else {
        toast.error(response.data.message);
      }

      return response.data;
    } catch (error: any) {
      toast.error(error.message);
      return error;
    }
  };
};

export const AddCustomer = (payload: Partial<customerType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(customerSlice.actions.hasError(null));
    try {
      const response = await api.post(API_ROUTES.CUSTOMER.ADD_CUSTOMER, payload);
      if (response.status === 201 || response.status === 200) {
        dispatch(getCustomers());
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};

// farm
export const AddCustomerFarm = (payload: Partial<FarmType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(customerSlice.actions.hasError(null));
    try {
      const response = await api.post(API_ROUTES.FARM.ADD_FARM, payload);
      if (response.status === 201 || response.status === 200) {
        dispatch(getCustomers());
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};

export const updateFarm = (payload: Partial<FarmType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(customerSlice.actions.hasError(null));
    try {
      const response = await api.put(API_ROUTES.FARM.UPDATE_FARM, payload);
      if (response.status === 201 || response.status === 200) {
        dispatch(getCustomers());
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};

export const deleteFarm = (payload: Partial<FarmType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(customerSlice.actions.hasError(null)); // Reset error state
    try {
      const response = await api.delete(API_ROUTES.FARM.DELETE_FARM, { data: payload });

      if (response.status === 200 || response.status === 204) {
        await dispatch(getCustomers());
      }

      return response.data;
    } catch (error: any) {
      return error;
    }
  };
};

export const { actions } = customerSlice;
export default customerSlice.reducer;
