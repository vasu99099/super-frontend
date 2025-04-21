import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppDispatch } from '..';
import api from '@/utils/axios';
import API_ROUTES from '@/constant/API_ROUTES';
import { customerType, FarmType } from '@/types/customerType';
import axios from 'axios';
import { toast } from 'react-toastify';

type ProductPackagingItem = {
  packSize: number | string;
  packagingType: string;
};

export type ProductImageType = {
  url: string;
  isPrimary: boolean;
};

export interface ProductType {
  product_id?: number | string;
  name: string;
  hsc_code: string;
  content_technical: string;
  categoryId: string | number;
  category: {
    name: string;
    description: string;
  };
  ProductPackaging: ProductPackagingItem[];
  ProductImage: ProductImageType[];
}

interface productState {
  products: ProductType[];
  totalProduct: number;
  singleActionProduct: ProductType | null;
  error: { message: string | Record<string, string>; errorCode?: string } | null;
  isLoading: boolean;
}

export interface productImagePresignType {
  fileType: string;
  size: number;
}

const initialState: productState = {
  products: [],
  totalProduct: 0,
  singleActionProduct: null,
  error: null,
  isLoading: false
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<{ products: productState['products']; totalRecords: number }>
    ) => {
      state.products = action.payload.products;
      state.totalProduct = action.payload.totalRecords;
    },
    setProductById: (state, action: PayloadAction<ProductType>) => {
      state.singleActionProduct = action.payload;
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

export const getProducts = (
  page = 1,
  order = 'desc',
  orderBy = '',
  pageSize = 10,
  searchText = '',
  abortSignal?: AbortSignal
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(productSlice.actions.hasError(null));
    dispatch(productSlice.actions.startLoading());
    try {
      const response = await api.get(
        `${API_ROUTES.PRODUCT.GET_PRODUCT}?page=${page}&order_by=${orderBy}&order=${order}&page_size=${pageSize}&search=${searchText}`,
        { signal: abortSignal }
      );

      if (response.status === 200) {
        dispatch(productSlice.actions.setProducts(response.data.data));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(productSlice.actions.stopLoading());
    }
  };
};
export const getProductById = (id: string | number) => {
  return async (dispatch: AppDispatch) => {
    dispatch(productSlice.actions.hasError(null));
    dispatch(productSlice.actions.startLoading());
    try {
      const response = await api.get(`${API_ROUTES.PRODUCT.GET_PRODUCT}?product_id=${id}`);

      if (response.status === 200) {
        dispatch(productSlice.actions.setProductById(response.data.data));
      }
      return response.data;
    } catch (error) {
      return error;
    } finally {
      dispatch(productSlice.actions.stopLoading());
    }
  };
};

export const AddProduct = (payload: Omit<ProductType, 'category'>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(productSlice.actions.hasError(null));
    try {
      const response = await api.post(API_ROUTES.PRODUCT.ADD_PRODUCT, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success('Product Created successfully');
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};

export const UpdateProduct = (payload: Partial<customerType>) => {
  return async (dispatch: AppDispatch) => {
    dispatch(productSlice.actions.hasError(null));
    try {
      const response = await api.put(API_ROUTES.PRODUCT.UPDATE_PRODUCT, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success('Product Updated successfully');
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};

export const getPresignProductUrl = (payload: productImagePresignType[]) => {
  return async (dispatch: AppDispatch) => {
    dispatch(productSlice.actions.hasError(null));
    try {
      const response = await api.post(API_ROUTES.PRODUCT.GET_PRESIGNED_URL, { images: payload });
      if (response.status === 201 || response.status === 200) {
        // dispatch(getCustomers());
      }
      return response.data;
    } catch (error) {
      return error;
    }
  };
};
export const uploadImageToS3 = async (url: string, file: File) => {
  try {
    const response = await axios.put(url, file, {
      headers: {
        'Content-Type': file.type
      },
      withCredentials: false
    });
    if (response.status === 201 || response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
export const deleteProduct = (
  product_id: Number,
  page = 1,
  order = 'desc',
  orderBy = '',
  pageSize = 10,
  searchText = ''
) => {
  return async (dispatch: AppDispatch) => {
    dispatch(productSlice.actions.hasError(null)); // Reset error state
    try {
      const response = await api.delete(API_ROUTES.PRODUCT.DELETE_PRODUCT, {
        data: { product_id }
      });

      if (response.status === 200 || response.status === 204) {
        await dispatch(getProducts(page, order, orderBy, pageSize, searchText)); // Ensure categories are updated after deletion
      }

      return response.data;
    } catch (error: any) {
      return error;
    }
  };
};

export const { actions } = productSlice;
export default productSlice.reducer;
