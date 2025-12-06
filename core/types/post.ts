/**
 * Post type definitions for the multistep form
 */

/**
 * Post category types
 */
export type PostCategory = 'music' | 'text' | 'image' | 'video';

/**
 * Form values for creating a post (user input)
 */
export interface PostFormValues {
  category: PostCategory;
  title: string;
  short_description: string;
  description?: string;
  song_id?: number;
  // For future implementation: media file paths
  media_url?: string;
}

/**
 * Complete post payload to send to API
 * Includes auto-filled fields
 */
export interface PostPayload {
  title: string;
  description?: string;
  short_description: string;
  publication_date: string; // ISO date string
  comments_number: number; // Default 0
  likes_number: number; // Default 0
  user_id: number;
  song_id?: number;
  category?: PostCategory;
  media_url?: string;
}

/**
 * Post entity returned from API
 */
export interface PostEntity {
  id: number;
  publication_date: string;
  title: string;
  description?: string;
  short_description: string;
  comments_number: number;
  likes_number: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  song_id?: number;
  category?: PostCategory;
  media_url?: string;
}
