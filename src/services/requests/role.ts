import { api } from 'boot/axios';
import type { Role } from 'src/types/role';

export interface CreateRolePayload {
  name: string;
}

export interface UpdateRolePayload {
  name?: string;
}

export interface RolePermissionPayload {
  permissionId: number;
}

export interface RolePermissionsResponse {
  permissions: number[];
}

export async function addRole(payload: CreateRolePayload): Promise<Role> {
  return (await api.post<{ role: Role }>('/roles', payload)).data.role;
}

export async function updateRole(id: number, payload: UpdateRolePayload): Promise<Role> {
  return (await api.put<{ role: Role }>(`/roles/${id}`, payload)).data.role;
}

export async function deleteRole(id: number): Promise<void> {
  return await api.delete(`/roles/${id}`);
}

export async function getRole(id: number): Promise<Role> {
  return (await api.get<{ role: Role }>(`/roles/${id}`)).data.role;
}

export async function attachPermission(roleId: number, permissionId: number): Promise<void> {
  const payload: RolePermissionPayload = { permissionId };
  await api.post(`/roles/${roleId}/permissions`, payload);
}

export async function detachPermission(roleId: number, permissionId: number): Promise<void> {
  await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
}
