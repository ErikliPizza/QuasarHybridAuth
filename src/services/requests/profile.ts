import { api } from 'boot/axios';
import type { Profile, Gender } from 'src/types/profile';

/**
 * Profile update payload structure
 * All fields are optional for partial updates
 */
export interface ProfileUpdatePayload {
  tfa?: boolean;
  birth_date?: string | null; // Y-m-d format, must be before today
  gender?: Gender | null;
  phone?: string | null;
  password?: string; // Requires password_confirmation
  password_confirmation?: string; // Required when password is provided
}

/**
 * Retrieves the current authenticated user's profile
 *
 * @returns A promise that resolves with the Profile object from the API
 */
export async function getProfile(): Promise<Profile> {
  return (await api.get<{ profile: Profile }>('/profile')).data.profile;
}

/**
 * Updates the current authenticated user's profile
 *
 * @param payload - Profile update data (all fields optional for partial updates)
 * @returns A promise that resolves with the updated Profile object from the API
 */
export async function updateProfile(payload: ProfileUpdatePayload): Promise<Profile> {
  return (await api.patch<{ profile: Profile }>('/profile', payload)).data.profile;
}
