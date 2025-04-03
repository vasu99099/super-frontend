import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { logout } from './util';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: boolean | string | object | null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
  // headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (request) => {
  const token = Cookies.get('authToken');
  request.headers.Authorization = token;
  return request;
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return {
      ...response,
      data: {
        success: response.data.success,
        data: response.data.data,
        message: response.data.message,
        error: response.data.error ?? null
      }
    };
  },
  (error: AxiosError) => {
    let errorMessage = 'Something went wrong.';
    let statusCode = 500;

    if (error.response) {
      statusCode = error.response.status;
      errorMessage = (error.response.data as ApiResponse)?.message || errorMessage;

      if (statusCode === 401) {
        const token = Cookies.get('authToken');
        if (token) {
          logout();
        }
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your internet connection.';
    } else {
      errorMessage = `Request error: ${error.message}`;
    }

    return Promise.reject({ success: false, message: errorMessage, status: statusCode });
  }
);

export default api;
