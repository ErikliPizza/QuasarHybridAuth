/**
 * import { api } from 'boot/axios';
 * import type { User } from 'src/types/user';
 *
 * export async function getProfile(): Promise<User> {
 *   return (await api.get('me/profile')).data;
 * }
 */

/**
 * Updates the password information for the currently authenticated user.
 *
 * @param new_password is the new password
 * @param password is the current password
 * @returns A promise that resolves with the updated User object from the API.
 *
 * export async function updatePassword(new_password: string, password: string): Promise<User> {
 *   return (await api.post('me/update-password', { password, new_password: new_password })).data;
 * }
 */

/**
 * Updates the 2FA information for the currently authenticated user.
 *
 * @param tfa is the tfa value
 * @returns A promise that resolves with the updated User object from the API.
 *
 * export async function updateTfa(tfa: boolean): Promise<User> {
 *   return (await api.post('me/update-tfa', { tfa })).data;
 * }
 */

