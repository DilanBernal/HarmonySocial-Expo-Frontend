import { HttpClient, HttpResponse } from '@/core/http';
import { Song, CreateSongDTO } from '@/core/models/data/Song';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { songQueryService } from './SongQueryService';

/**
 * SongCommandService - Service for creating, updating, and deleting songs.
 * Follows Single Responsibility Principle - only handles write operations.
 */
export class SongCommandService {
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient(process.env.EXPO_PUBLIC_API_URL);
  }

  /**
   * Creates a new song.
   * Automatically clears the user songs cache after successful creation.
   * @param dto - Song creation data
   * @returns Observable of created song
   */
  create(dto: CreateSongDTO): Observable<HttpResponse<Song>> {
    return this.httpClient.post<Song>('songs', dto).pipe(
      tap(() => {
        // Clear cache when a new song is created
        songQueryService.clearUserSongsCache();
        console.log('[SongCommandService] Song created successfully');
      }),
      catchError((error) => {
        console.error('[SongCommandService] create error:', error);
        throw error;
      })
    );
  }

  /**
   * Updates an existing song.
   * Automatically clears the user songs cache after successful update.
   * @param id - Song ID to update
   * @param updates - Partial song data to update
   * @returns Observable of updated song
   */
  update(id: string, updates: Partial<CreateSongDTO>): Observable<HttpResponse<Song>> {
    return this.httpClient.put<Song>(`songs/${id}`, updates).pipe(
      tap(() => {
        // Clear cache when a song is updated
        songQueryService.clearUserSongsCache();
        console.log('[SongCommandService] Song updated successfully');
      }),
      catchError((error) => {
        console.error('[SongCommandService] update error:', error);
        throw error;
      })
    );
  }

  /**
   * Deletes a song.
   * Automatically clears the user songs cache after successful deletion.
   * @param id - Song ID to delete
   * @returns Observable of void
   */
  delete(id: string): Observable<HttpResponse<void>> {
    return this.httpClient.delete<void>(`songs/${id}`).pipe(
      tap(() => {
        // Clear cache when a song is deleted
        songQueryService.clearUserSongsCache();
        console.log('[SongCommandService] Song deleted successfully');
      }),
      catchError((error) => {
        console.error('[SongCommandService] delete error:', error);
        throw error;
      })
    );
  }
}

// Export singleton instance
export const songCommandService = new SongCommandService();
