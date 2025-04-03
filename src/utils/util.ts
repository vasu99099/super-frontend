import Cookies from 'js-cookie';
import { ROUTE_PATH } from '@/constant/Routes';

export const logout = () => {
  Cookies.remove('authToken');
  window.location.href = ROUTE_PATH.AUTH.LOGIN;
};

export function getNestedValue(obj: any, key: string): any {
  return key.split('.').reduce((acc, part) => acc?.[part], obj) || '-';
}
