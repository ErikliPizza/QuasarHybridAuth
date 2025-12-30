import { api } from 'boot/axios';
import type { Department } from 'src/types/department';

export interface CreateDepartmentPayload {
  name: string;
  description: string | null;
}

export interface UpdateDepartmentPayload {
  name?: string;
  description?: string | null;
}

export async function addDepartment(payload: CreateDepartmentPayload): Promise<Department> {
  return (await api.post<{ department: Department }>('/departments', payload)).data.department;
}

export async function updateDepartment(
  id: number,
  payload: UpdateDepartmentPayload,
): Promise<Department> {
  return (await api.put<{ department: Department }>(`/departments/${id}`, payload)).data.department;
}

export async function deleteDepartment(id: number): Promise<void> {
  return await api.delete(`/departments/${id}`);
}

export async function getDepartment(id: number): Promise<Department> {
  return (await api.get<{ department: Department }>(`/departments/${id}`)).data.department;
}
