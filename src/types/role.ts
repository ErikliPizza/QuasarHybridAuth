import type { Permission } from 'src/types/permission';

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}
