/**
 * Song model representing a song entity.
 */
export interface Song {
  id: number;
  title: string;
  audioUrl: string;
  createdAt: string;
  artist?: string;
  genre?: string;
  duration?: number;
  artwork?: string;
}

/**
 * DTO for creating a new song.
 */
export interface CreateSongDTO {
  title: string;
  artist: string;
  audioUrl: string;
  genre?: string;
  description?: string;
  duration?: number;
  bpm?: number;
  decade?: number;
  country?: string;
}
