export interface FarmType {
  farm_id?: number;
  farm_name: string;
  customer_id: number;
  village_id: number;
  village_name?: string;
  longitude?: number | null;
  latitude?: number | null;
}
export interface customerType {
  customer_id?: number;
  name: string;
  address?: string;
  village: { name: string; id: number };
  farms: FarmType[];
  phone: string;
  whatsapp_number?: string;
  email?: string;
  longitude?: string;
  latitude?: string;
}
