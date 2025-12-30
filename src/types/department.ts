export interface Department {
  id: number;
  name: string;
  description: string | null;
  employees_count?: number;
  created_at?: string;
  updated_at?: string;
}

export type ApiDepartment = Readonly<Department>;
