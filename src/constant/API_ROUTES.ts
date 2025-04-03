const API_ROUTES = {
  LOGIN: 'auth/login',
  WHOAMI: 'user/whomi',
  UPDATE_PROFILE: 'user/profileupdate',
  UPDATE_PROFILE_IMAGE: 'user/uploadprofilepic',
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
    GET_VILLAGE: 'village/getVillage'
  }
};

export default API_ROUTES;
