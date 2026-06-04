import type { Permission } from './permission';
import type { Role } from './role';

export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  gravatar: string;
  tfa: boolean;
  status: number;
  status_label: string;
  role?: Role | null;
  permissions?: Permission[];
  created_at: string | null;
  updated_at: string | null;
}
