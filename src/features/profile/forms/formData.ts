import { api } from 'src/boot/axios';
import type { ApiResourceResponse } from 'src/boot/axios';
import type { Profile } from 'src/types/profile';

export type ProfileFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export const PROFILE_FORM_DEFAULTS: ProfileFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
};

export const createProfileFormData = (): ProfileFormData => ({
  ...PROFILE_FORM_DEFAULTS,
});

export const mapProfileToFormData = (profile: Profile | null): ProfileFormData => ({
  name: profile?.name ?? '',
  email: profile?.email ?? '',
  phone: profile?.phone ?? '',
  password: '',
});

export async function getProfile(): Promise<Profile> {
  return (await api.get<ApiResourceResponse<Profile>>('/profile')).data;
}

export async function toggleProfileTfa(): Promise<Profile> {
  return (await api.patch<ApiResourceResponse<Profile>>('/profile/tfa')).data;
}
