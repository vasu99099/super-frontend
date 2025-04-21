import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '..';
import api from '@/utils/axios';
import API_ROUTES from '@/constant/API_ROUTES';
import { customerType, FarmType } from '@/types/customerType';
import axios from 'axios';
import { toast } from 'react-toastify';

type SuggestionType = {
  product_id: number | string;
  note: string;
};

type Suggestion = {
  suggested_id: number;
  product_id: number;
  note: string | null;
  dosage_id: number;
  product: string; // product name only
};

export type DosageType = {
  dosage_id: number;
  farm_id: number;
  customer_id: number;
  isClosed: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  suggestions: Suggestion[];
};

export interface DosageSuggestionListType {
  open: DosageType[] | [];
  closed: DosageType[];
}

export interface DosageSuggestionType {
  farm_id: number | string;
  customer_id: number | string;
  suggestions: SuggestionType[];
}

interface DosageState {
  dosages: DosageSuggestionListType | null;
  error: { message: string | Record<string, string>; errorCode?: string } | null;
  isLoading: boolean;
}

const initialState: DosageState = {
  dosages: null,
  error: null,
  isLoading: false
};

const dosageSlice = createSlice({
  name: 'dosage',
  initialState,
  reducers: {
    setDosageSuggestion: (state, action: PayloadAction<{ data: DosageSuggestionListType }>) => {
      console.log('action', action);
      state.dosages = action.payload.data;
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

export const getDosages = (id: string | number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(dosageSlice.actions.hasError(null));
    dispatch(dosageSlice.actions.startLoading());
    try {
      const response = await api.get(`${API_ROUTES.DOSAGE.GET_DOSAGE(id)}`);
      console.log('response', response);
      if (response.status === 200) {
        dispatch(dosageSlice.actions.setDosageSuggestion(response.data));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(dosageSlice.actions.stopLoading());
    }
  };
};
export const getDosageById = (id: string | number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(dosageSlice.actions.hasError(null));
    dispatch(dosageSlice.actions.startLoading());
    try {
      const response = await api.get(`${API_ROUTES.DOSAGE.DOSAGE_BY_ID(id)}`);
      return response.data;
    } catch (error) {
      toast.error((error as Error).message);
      return error;
    } finally {
      dispatch(dosageSlice.actions.stopLoading());
    }
  };
};

export const AddDosage = (payload: DosageSuggestionType) => {
  return async (dispatch: AppDispatch) => {
    dispatch(dosageSlice.actions.hasError(null));
    try {
      const response = await api.post(API_ROUTES.DOSAGE.ADD_DOSAGE, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success('Suggestion Created successfully');
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};

export const MarkDosageAsPurchased = (dosage_id: string | number, farm_id: string | number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(dosageSlice.actions.hasError(null));
    try {
      const response = await api.put(API_ROUTES.DOSAGE.MARK_DOSAGE_AS_PURCHASED(dosage_id));
      if (response.status === 201 || response.status === 200) {
        dispatch(getDosages(farm_id));
        toast.success('Dosage has been mark as purchased');
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};
export const UpdateDosage = (payload: Partial<DosageSuggestionType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(dosageSlice.actions.hasError(null));
    try {
      const response = await api.put(API_ROUTES.DOSAGE.UPDATE_DOSAGE, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success('Suggestion Updated successfully');
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};

export const deleteDosage = (dosage_id: Number, farm_id: string | number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(dosageSlice.actions.hasError(null)); // Reset error state
    try {
      const response = await api.delete(API_ROUTES.DOSAGE.DELETE_DOSAGE, {
        data: { dosage_id }
      });

      if (response.status === 200 || response.status === 204) {
        await dispatch(getDosages(farm_id));
      }

      return response.data;
    } catch (error: any) {
      return error;
    }
  };
};

export const { actions } = dosageSlice;
export default dosageSlice.reducer;
