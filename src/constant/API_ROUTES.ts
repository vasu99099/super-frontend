const API_ROUTES = {
  LOGIN: 'auth/login',
  WHOAMI: 'user/whomi',
  UPDATE_PROFILE: 'user/profileupdate',
  UPDATE_PROFILE_IMAGE: 'user/uploadprofilepic',
  DASHBOARD: '/dashboard',
  CATEGORY: {
    GET_CATEGORY: '/category/getAllcategory',
    ADD_CATEGORY: '/category/addCategory',
    UPDATE_CATEGORY: '/category/updateCategory',
    DELETE_CATEGORY: '/category/deleteCategory'
  },
  CUSTOMER: {
    GET_CUSTOMER: '/customer/getAllCustomer',
    ADD_CUSTOMER: '/customer/addCustomer',
    UPDATE_CUSTOMER: '/customer/updateCustomer',
    DELETE_CUSTOMER: '/customer/deleteCustomer'
  },
  FARM: {
    GET_FARM: '/farm/getAllFarm',
    ADD_FARM: '/farm/addFarm',
    UPDATE_FARM: '/farm/updateFarm',
    DELETE_FARM: '/farm/deleteFarm'
  },
  VILLAGE: {
    GET_VILLAGE: '/village/getVillage'
  },
  PRODUCT: {
    GET_PRESIGNED_URL: '/product/getProductPresign',
    ADD_PRODUCT: '/product/addProduct',
    UPDATE_PRODUCT: '/product/updateProduct',
    GET_PRODUCT: '/product/getProduct',
    DELETE_PRODUCT: '/product/deleteProduct'
  },
  DOSAGE: {
    GET_DOSAGE: (id: string | number) => `/dosage/${id}`,
    ADD_DOSAGE: '/dosage/addDosage',
    MARK_DOSAGE_AS_PURCHASED: (id: string | number) => `/dosage/markAsPurchased/${id}`,
    DOSAGE_BY_ID: (id: string | number) => `/dosage/dosageById/${id}`,
    UPDATE_DOSAGE: '/dosage/updateDosage/',
    GET_PRODUCT: '/product/getProduct',
    DELETE_DOSAGE: '/dosage/deleteDosage'
  }
};

export default API_ROUTES;
