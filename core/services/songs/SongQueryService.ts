import { Song } from '@/core/models/data/Song';
import { Paginated } from '@/core/models/utils/Paginated';
import { Observable, of, Subject } from 'rxjs';
import { Axios } from 'rxjs-axios';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';

export type ApiEnvelope<T> = { success: boolean; data: T };

/**
 * SongQueryService - Service for querying and searching songs.
 * Follows Single Responsibility Principle - only handles read operations.
 */
export class SongQueryService {
  private httpClient;
  private searchSubject = new Subject<string>();
  private searchResults$ = new Subject<Song[]>();

  // Cache for user's song list
  private myListCache$: Observable<Paginated<Song>
  > | null = null;
  private lastPage: number = 0;
  private lastLimit: number = 0;

  constructor() {
    this.httpClient = Axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL,

    });
    this.setupDebouncedSearch();
  }

  /**
   * Sets up the debounced search stream for reactive search functionality.
   */
  private setupDebouncedSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.executeSearch(query))
      )
      .subscribe((results) => {
        this.searchResults$.next(results);
      });
  }

  /**
   * Executes the actual search API call.
   */
  private executeSearch(query: string): Observable<Song[]> {
    if (!query.trim()) {
      return of({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
      } as any);
    }

    return this.httpClient
      .get<Song[]>(`/songs/search?q=${encodeURIComponent(query)}`)
      .pipe(
        map(x => x.data),
        catchError((error) => {
          console.error('[SongQueryService] Search error:', error);
          return of([]);
        })
      );
  }

  /**
   * Searches songs with automatic debounce (300ms).
   * Use this for real-time search inputs.
   * @param query - Search query string
   * @returns Observable of search results
   */
  searchDebounced(query: string): Observable<Song[]> {
    this.searchSubject.next(query);
    return this.searchResults$.asObservable();
  }

  /**
   * Searches songs immediately without debounce.
   * Use this for programmatic search or when debounce is handled elsewhere.
   * @param query - Search query string
   * @returns Observable of search results
   */
  search(query: string): Observable<Song[]> {
    return this.executeSearch(query);
  }

  /**
   * Gets a single song by ID.
   * @param id - Song ID
   * @returns Observable of song data
   */
  getById(id: string): Observable<Song> {
    return this.httpClient.get<Song>(`songs/${id}`).pipe(
      catchError((error) => {
        console.error('[SongQueryService] getById error:', error);
        throw error;
      }),
      map(x => x.data)
    );
  }

  /**
   * Lists the current user's songs with pagination and caching.
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Observable of paginated song list
   */
  listUserSongs(
    page = 1,
    limit = 20
  ): Observable<Paginated<Song>> {
    console.log(`[SongQueryService] Fetching user songs - page: ${page}, limit: ${limit}`);

    // Return cached result if same request
    if (this.myListCache$ && this.lastPage === page && this.lastLimit === limit) {
      console.log('[SongQueryService] Returning cached result');
      return this.myListCache$;
    }

    // Update cache parameters
    this.lastPage = page;
    this.lastLimit = limit;

    // Create new request with caching
    this.myListCache$ = this.httpClient
      .get<Paginated<Song>>(`/songs/mine/list?page=${page}&limit=${limit}`)
      .pipe(
        tap((response) => {
          console.log('[SongQueryService] listUserSongs response:', response);
        }),
        map((x => x.data)),
        shareReplay(1),
        catchError((error) => {
          console.error('[SongQueryService] listUserSongs error:', error);
          this.myListCache$ = null;
          throw error;
        })
      );

    return this.myListCache$ as any;
  }

  /**
   * Lists all songs with pagination.
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Observable of paginated song list
   */
  listAll(
    page = 1,
    limit = 20
  ): Observable<Paginated<Song>> {
    console.log(`[SongQueryService] Fetching all songs - page: ${page}, limit: ${limit}`);

    return this.httpClient
      .get<Paginated<Song>>(`songs?page=${page}&limit=${limit}`)
      .pipe(
        map(x => x.data),
        tap((response) => {
          console.log('[SongQueryService] listAll response:', response);
        }),
        catchError((error) => {
          console.error('[SongQueryService] listAll error:', error);
          throw error;
        })
      );
  }

  /**
   * Clears the user's song list cache.
   * Call this after creating, updating, or deleting songs.
   */
  clearUserSongsCache(): void {
    this.myListCache$ = null;
    console.log('[SongQueryService] User songs cache cleared');
  }

  /**
   * Gets the streaming URL for a song.
   * @param blobName - Blob name of the song file
   * @returns Streaming URL string
   */
  getStreamUrl(blobName: string): string {
    console.log('[SongQueryService] Getting stream URL for:', blobName);
    return `${process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '')}/file/song?id=${encodeURIComponent(blobName)}`;
  }
}

// Export singleton instance
export const songQueryService = new SongQueryService();
