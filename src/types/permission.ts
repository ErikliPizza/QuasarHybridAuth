export interface Permission {
  id: number;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export type ApiPermission = Readonly<Permission>;
