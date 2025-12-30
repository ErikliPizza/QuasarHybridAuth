/**
 * Gender options
 */
export type Gender = 'male' | 'female';

/**
 * Full user profile returned from the API
 */
export interface Profile {
  id: number;
  name: string;
  email: string;
  gravatar: string;
  tfa: boolean;
  birth_date: string | null; // Y-m-d format
  gender: Gender | null;
  phone: string | null;
  created_at: string | null; // ISO string format
  updated_at: string | null; // ISO string format
}
