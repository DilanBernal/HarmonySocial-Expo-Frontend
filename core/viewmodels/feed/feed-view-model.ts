import Post from '@/core/models/data/Post';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Feed ViewModel - Manages the feed screen state and logic following MVVM pattern.
 * Separates business logic from the view layer for better maintainability.
 */
const useFeedViewModel = () => {
  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // RxJS subjects for cleanup
  const destroy$ = useRef(new Subject<void>()).current;
  const subscriptionRef = useRef<Subscription | null>(null);

  /**
   * Loads the feed posts from the API.
   * Currently returns empty array as the feed service is not yet implemented.
   */
  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // TODO: Implement feed service with RxJS Observable
      // For now, we'll just set an empty array
      console.log('[FeedViewModel] Loading feed posts...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Feed data will come from the API
      setPosts([]);
      setIsLoading(false);
    } catch (error) {
      console.error('[FeedViewModel] Error loading feed:', error);
      setErrorMessage('Error al cargar el feed. Intenta nuevamente.');
      setIsLoading(false);
    }
  }, []);

  /**
   * Refreshes the feed (pull-to-refresh functionality).
   */
  const refreshFeed = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);

    try {
      console.log('[FeedViewModel] Refreshing feed...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Feed data will come from the API
      setPosts([]);
      setIsRefreshing(false);
    } catch (error) {
      console.error('[FeedViewModel] Error refreshing feed:', error);
      setErrorMessage('Error al actualizar el feed.');
      setIsRefreshing(false);
    }
  }, []);

  /**
   * Clears the error message.
   */
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  /**
   * Checks if the feed is empty.
   */
  const isFeedEmpty = useCallback(() => {
    return posts.length === 0;
  }, [posts]);

  // Load feed on mount
  useEffect(() => {
    loadFeed();

    // Cleanup on unmount
    return () => {
      destroy$.next();
      destroy$.complete();
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [loadFeed, destroy$]);

  return {
    // State
    posts,
    isLoading,
    isRefreshing,
    errorMessage,
    // Computed
    isFeedEmpty,
    // Actions
    loadFeed,
    refreshFeed,
    clearError,
  };
};

export default useFeedViewModel;
