export const ROUTE_PATH = {
  HOME: '/',
  AUTH: {
    LOGIN: '/signin',
    REGISTER: '/signup',
    FORGOT_PASS: '/reset-password'
  },
  ADMIN: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    CATEGORY: '/category',
    product: '/product',
    customer: {
      INDEX: '/customer',
      ADD_CUSTOMER: '/customer/add',
      EDIT_CUSTOMER: (id: string | number) => `/customer/edit/${id}`
    }
  }
};
export const PUBLIC_ROUTES = [ROUTE_PATH.AUTH.LOGIN];
export const PROTECTED_ROUTES = [ROUTE_PATH.ADMIN.DASHBOARD, ROUTE_PATH.ADMIN.CATEGORY];
