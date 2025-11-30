import {
  ApiEnvelope,
  Song,
  songsService,
} from '@/core/services/songs/GetSongService';
import { Paginated } from '@/core/models/utils/Paginated';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

/**
 * Type for the songs list response from the API.
 */
interface SongsListResponse {
  data?: ApiEnvelope<Paginated<Song>>;
}

/**
 * Library ViewModel - Manages the library screen state and logic following MVVM pattern.
 * Uses RxJS for reactive data handling with proper cleanup.
 */
const useLibraryViewModel = () => {
  // State
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // RxJS subjects for cleanup
  const destroy$ = useRef(new Subject<void>()).current;
  const subscriptionRef = useRef<Subscription | null>(null);
  const isLoadingRef = useRef(false);

  /**
   * Loads the user's songs from the API.
   */
  const loadSongs = useCallback(
    (page = 1, limit = 50) => {
      if (isLoadingRef.current) {
        console.log('[LibraryViewModel] Already loading, skipping...');
        return;
      }

      console.log('[LibraryViewModel] Loading songs...');
      isLoadingRef.current = true;
      setIsLoading(true);
      setErrorMessage(null);

      // Clean up previous subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      subscriptionRef.current = songsService
        .listMine(page, limit)
        .pipe(
          takeUntil(destroy$),
          finalize(() => {
            setIsLoading(false);
            isLoadingRef.current = false;
          })
        )
        .subscribe({
          next: (response: SongsListResponse) => {
            console.log('[LibraryViewModel] Songs loaded:', response);
            const songsData = response?.data?.data?.rows ?? [];
            setSongs(songsData);
          },
          error: (error: Error) => {
            console.error('[LibraryViewModel] Error loading songs:', error);
            setErrorMessage(
              error?.message ?? 'No se pudo cargar tu biblioteca'
            );
          },
        });
    },
    [destroy$]
  );

  /**
   * Refreshes the library (pull-to-refresh functionality).
   */
  const refreshLibrary = useCallback(() => {
    if (isLoadingRef.current) {
      console.log('[LibraryViewModel] Already loading, skipping refresh...');
      return;
    }

    console.log('[LibraryViewModel] Refreshing library...');
    setIsRefreshing(true);
    isLoadingRef.current = true;

    // Clear cache to force fresh fetch (with error handling)
    try {
      songsService.clearMyListCache();
    } catch (error) {
      console.warn('[LibraryViewModel] Error clearing cache:', error);
      // Continue with refresh even if cache clear fails
    }

    // Clean up previous subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = songsService
      .listMine(1, 50)
      .pipe(
        takeUntil(destroy$),
        finalize(() => {
          setIsRefreshing(false);
          isLoadingRef.current = false;
        })
      )
      .subscribe({
        next: (response: SongsListResponse) => {
          console.log('[LibraryViewModel] Library refreshed:', response);
          const songsData = response?.data?.data?.rows ?? [];
          setSongs(songsData);
        },
        error: (error: Error) => {
          console.error('[LibraryViewModel] Error refreshing:', error);
          setErrorMessage(
            error?.message ?? 'No se pudo actualizar tu biblioteca'
          );
        },
      });
  }, [destroy$]);

  /**
   * Clears the error message.
   */
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  /**
   * Retries loading the library after an error.
   */
  const retry = useCallback(() => {
    setErrorMessage(null);
    isLoadingRef.current = false;
    loadSongs();
  }, [loadSongs]);

  /**
   * Checks if the library is empty.
   */
  const isLibraryEmpty = useCallback(() => {
    return songs.length === 0;
  }, [songs]);

  // Load songs on mount
  useEffect(() => {
    loadSongs();

    // Cleanup on unmount
    return () => {
      destroy$.next();
      destroy$.complete();
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [loadSongs, destroy$]);

  return {
    // State
    songs,
    isLoading,
    isRefreshing,
    errorMessage,
    // Computed
    isLibraryEmpty,
    // Actions
    loadSongs,
    refreshLibrary,
    clearError,
    retry,
  };
};

export default useLibraryViewModel;
