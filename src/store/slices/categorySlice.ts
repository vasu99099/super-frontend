import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '..';
import api from '@/utils/axios';
import API_ROUTES from '@/constant/API_ROUTES';

type singleCategory = { category_id: number; name: string; description: string };
interface CategoryState {
  categories: singleCategory[];
  totalCategory: number;
  singleActionCat: singleCategory | null;
  error: { message: string | Record<string, string>; errorCode?: string } | null;
  isLoading: boolean;
}
// type UserType = AuthState['user'];

const initialState: CategoryState = {
  categories: [],
  totalCategory: 0,
  singleActionCat: null,
  error: null,
  isLoading: false
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories: (
      state,
      action: PayloadAction<{ categories: CategoryState['categories']; totalRecords: number }>
    ) => {
      state.categories = action.payload.categories;
      state.totalCategory = action.payload.totalRecords;
    },
    setCategoriesById: (state, action: PayloadAction<string | number>) => {
      const id = Number(action.payload);
      const category = state.categories.find((s) => s.category_id === id);
      if (category) {
        state.singleActionCat = category;
      } else {
        state.singleActionCat = null;
      }
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

export const getCategories = (
  page = 1,
  order = 'desc',
  orderBy = '',
  pageSize = 10,
  searchText = '',
  abortSignal?: AbortSignal
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(categorySlice.actions.hasError(null));
    dispatch(categorySlice.actions.startLoading());
    try {
      const response = await api.get(
        `${API_ROUTES.CATEGORY.GET_CATEGORY}?page=${page}&order_by=${orderBy}&order=${order}&page_size=${pageSize}&search=${searchText}`,
        { signal: abortSignal }
      );

      if (response.status === 200) {
        dispatch(categorySlice.actions.setCategories(response.data.data));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(categorySlice.actions.stopLoading());
    }
  };
};
export const getAllCategoriesList = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(categorySlice.actions.hasError(null));
    dispatch(categorySlice.actions.startLoading());
    try {
      const response = await api.get(`${API_ROUTES.CATEGORY.GET_CATEGORY}`);

      if (response.status === 200) {
        dispatch(categorySlice.actions.setCategories(response.data.data));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(categorySlice.actions.stopLoading());
    }
  };
};

export const getCategoriesById = (id: string | number) => {
  return async (dispatch: AppDispatch) => {
    try {
      dispatch(categorySlice.actions.setCategoriesById(id));
    } catch (error) {
      return error;
    }
  };
};
export const updateCategory = (payload: Partial<singleCategory>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(categorySlice.actions.hasError(null));
    try {
      const response = await api.put(API_ROUTES.CATEGORY.UPDATE_CATEGORY, payload);
      if (response.status === 201 || response.status === 200) {
        dispatch(getCategories());
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};
export const deleteCategory = (payload: Partial<singleCategory>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(categorySlice.actions.hasError(null)); // Reset error state
    try {
      const response = await api.delete(API_ROUTES.CATEGORY.DELETE_CATEGORY, { data: payload });

      if (response.status === 200 || response.status === 204) {
        await dispatch(getCategories()); // Ensure categories are updated after deletion
      }

      return response.data;
    } catch (error: any) {
      return error;
    }
  };
};

export const AddCategory = (payload: Partial<singleCategory>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(categorySlice.actions.hasError(null));
    try {
      const response = await api.post(API_ROUTES.CATEGORY.ADD_CATEGORY, payload);
      if (response.status === 201 || response.status === 200) {
        dispatch(getCategories());
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};
export const { actions } = categorySlice;
export default categorySlice.reducer;
