import type { Role } from './role';
import type { User } from './user';

export interface Permission {
  id: number;
  name: string;
  description: string | null;
  action: string | null;
  role_id: number | null;
  role?: Role | null;
  users?: User[] | null;
  created_at?: string;
  updated_at?: string;
}

export type PermissionFormData = {
  name: string;
  description: string;
  action: string;
  role_id: number | null;
};
