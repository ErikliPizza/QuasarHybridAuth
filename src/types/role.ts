import type { Permission } from './permission';
import type { User } from './user';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[] | null;
  users?: User[] | null;
  created_at?: string;
  updated_at?: string;
}

export type RoleFormData = {
  name: string;
  description: string;
};
