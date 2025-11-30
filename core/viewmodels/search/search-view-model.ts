import {
  SearchResponse,
  searchService,
} from '@/core/services/search/search-service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

/**
 * Search ViewModel - Manages the search screen state and logic following MVVM pattern.
 * Uses RxJS for reactive search with debounce, distinctUntilChanged, and proper cleanup.
 */
const useSearchViewModel = () => {
  // State
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResponse>({
    users: [],
    artists: [],
    songs: [],
  });

  // RxJS subjects
  const searchSubject = useRef(new BehaviorSubject<string>('')).current;
  const destroy$ = useRef(new Subject<void>()).current;
  const subscriptionRef = useRef<Subscription | null>(null);

  /**
   * Sets up the search stream with debounce and distinctUntilChanged.
   */
  useEffect(() => {
    subscriptionRef.current = searchSubject
      .pipe(
        takeUntil(destroy$),
        // Debounce to prevent excessive API calls
        debounceTime(300),
        // Only emit when the value changes
        distinctUntilChanged(),
        // Show loading state
        tap((q) => {
          if (q.trim()) {
            setIsLoading(true);
            setErrorMessage(null);
          }
        }),
        // Only search if query has content
        filter((q) => {
          if (!q.trim()) {
            setResults({ users: [], artists: [], songs: [] });
            setIsLoading(false);
            return false;
          }
          return true;
        }),
        // Switch to the search observable (cancels previous if new query comes in)
        switchMap((q) => searchService.searchAll(q))
      )
      .subscribe({
        next: (searchResults) => {
          console.log('[SearchViewModel] Search results received:', {
            users: searchResults.users.length,
            artists: searchResults.artists.length,
            songs: searchResults.songs.length,
          });
          setResults(searchResults);
          setIsLoading(false);
        },
        error: (error) => {
          console.error('[SearchViewModel] Search error:', error);
          setErrorMessage('Error al buscar. Intenta nuevamente.');
          setIsLoading(false);
        },
      });

    // Cleanup on unmount
    return () => {
      // First unsubscribe from any active subscriptions
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      // Then signal completion to stop any pending operations
      destroy$.next();
      destroy$.complete();
    };
  }, [searchSubject, destroy$]);

  /**
   * Handles query change from the search input.
   * Uses RxJS subject to trigger debounced search.
   */
  const onQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      searchSubject.next(text);
    },
    [searchSubject]
  );

  /**
   * Clears the search query and results.
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults({ users: [], artists: [], songs: [] });
    searchSubject.next('');
    setErrorMessage(null);
  }, [searchSubject]);

  /**
   * Clears the error message.
   */
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  /**
   * Checks if there are any search results.
   */
  const hasResults = useCallback(() => {
    return (
      results.users.length > 0 ||
      results.artists.length > 0 ||
      results.songs.length > 0
    );
  }, [results]);

  /**
   * Gets the total count of search results.
   */
  const totalResultsCount = useCallback(() => {
    return results.users.length + results.artists.length + results.songs.length;
  }, [results]);

  return {
    // State
    query,
    isLoading,
    errorMessage,
    results,
    // Computed
    hasResults,
    totalResultsCount,
    // Actions
    onQueryChange,
    clearSearch,
    clearError,
  };
};

export default useSearchViewModel;
