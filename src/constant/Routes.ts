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
    product: {
      INDEX: '/product',
      ADD_PRODUCT: '/product/create',
      EDIT_PRODUCT: (id: string | number) => `/product/edit/${id}`
    },
    customer: {
      INDEX: '/customer',
      DETAIL: (id: string | number, farm_id?: string | number) =>
        `/customer/${id}${farm_id ? `?farm=${farm_id}` : ''}`,
      ADD_CUSTOMER: '/customer/add',
      EDIT_CUSTOMER: (id: string | number) => `/customer/edit/${id}`
    },
    DOSAGE_SUGGESTION: {
      INDEX: '/suggestions/add',
      ADD_DOSAGE_SUGGESTION: (id: string | number) => `/suggestions/add?customer_id=${id}`,
      EDIT_DOSAGE_SUGGESTION: (
        id: string | number,
        dosage_Id: string | number,
        farm_Id: string | number
      ) => `/suggestions/edit?customer_id=${id}&dosage_id=${dosage_Id}&farm_id=${farm_Id}`
    }
  }
};
export const PUBLIC_ROUTES = [ROUTE_PATH.AUTH.LOGIN];
export const PROTECTED_ROUTES = [
  ROUTE_PATH.ADMIN.DASHBOARD,
  ROUTE_PATH.ADMIN.PROFILE,
  ROUTE_PATH.ADMIN.CATEGORY,

  // Product Routes
  ROUTE_PATH.ADMIN.product.INDEX,
  ROUTE_PATH.ADMIN.product.ADD_PRODUCT,
  ROUTE_PATH.ADMIN.product.EDIT_PRODUCT(':id'),

  // Customer Routes
  ROUTE_PATH.ADMIN.customer.INDEX,
  ROUTE_PATH.ADMIN.customer.ADD_CUSTOMER,
  ROUTE_PATH.ADMIN.customer.EDIT_CUSTOMER(':id'),
  ROUTE_PATH.ADMIN.customer.DETAIL(':id', ':farm_id'),

  // Dosage Suggestion Routes
  ROUTE_PATH.ADMIN.DOSAGE_SUGGESTION.INDEX,
  ROUTE_PATH.ADMIN.DOSAGE_SUGGESTION.ADD_DOSAGE_SUGGESTION(':id'),
  ROUTE_PATH.ADMIN.DOSAGE_SUGGESTION.EDIT_DOSAGE_SUGGESTION(':id', ':dosage_id', ':farm_id')
];
