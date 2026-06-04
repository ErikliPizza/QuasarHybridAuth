import type { Role } from 'src/types/role';
import type { Permission } from 'src/types/permission';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role?: Role | null;
  permissions?: Permission[];
  tfa: boolean;
  last_login_at?: string | null;
  status: number;
  status_label: string;
  created_at: string;
  updated_at: string;
}

export type UserFormData = {
  name: string;
  phone: string;
  email: string;
  role_id: number | null;
  permission_ids: number[] | null;
  tfa: number;
  status: number;
  password: string;
};
