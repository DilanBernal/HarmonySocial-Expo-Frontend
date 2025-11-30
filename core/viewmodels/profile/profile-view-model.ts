import UserBasicData from '@/core/dtos/user/UserBasicData';
import AuthUserService from '@/core/services/AuthUserService';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Subject, Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

/**
 * Profile ViewModel - Manages the profile screen state and logic following MVVM pattern.
 * Uses RxJS for reactive data handling with proper cleanup.
 */
const useProfileViewModel = () => {
  // State
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string>('');
  const [memberSince, setMemberSince] = useState<string>('');
  const [learningPoints, setLearningPoints] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Services
  const authUserService = useRef(new AuthUserService()).current;

  // RxJS subjects for cleanup
  const destroy$ = useRef(new Subject<void>()).current;
  const subscriptionRef = useRef<Subscription | null>(null);

  /**
   * Updates the profile state from user data.
   */
  const updateProfileState = useCallback((userData: UserBasicData) => {
    setUsername(userData.username || '');
    setProfileImage(userData.profileImage);
    setMemberSince(String(userData.activeFrom || ''));
    setLearningPoints(userData.learningPoints);
  }, []);

  /**
   * Loads user profile data from AsyncStorage.
   */
  const loadProfileFromStorage = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const userStorage = await authUserService.getDataInfoFromAsyncStorage();
      console.log('[ProfileViewModel] User data from storage:', userStorage);

      if (!userStorage) {
        console.log('[ProfileViewModel] No user data in storage, logging out...');
        await logout();
        return;
      }

      // Update state with stored data
      setProfileImage(userStorage.profileImage);
      setUsername(userStorage.username || '');
      setMemberSince(userStorage.activeFrom || '');
      setLearningPoints(userStorage.learningPoints);
      setIsLoading(false);
    } catch (error) {
      console.error('[ProfileViewModel] Error loading profile:', error);
      setErrorMessage('Error al cargar el perfil.');
      setIsLoading(false);
    }
  }, [authUserService]);

  /**
   * Refreshes profile data from the API.
   */
  const refreshProfile = useCallback(() => {
    setIsRefreshing(true);
    setErrorMessage(null);

    // Get user ID from storage first
    authUserService.getIdSyncFromAsyncStorage();

    // Small delay to ensure ID is loaded
    setTimeout(() => {
      // Clean up previous subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      subscriptionRef.current = authUserService
        .getDataInfoFromApi()
        .pipe(
          takeUntil(destroy$),
          finalize(() => {
            setIsRefreshing(false);
          })
        )
        .subscribe({
          next: (value) => {
            console.log('[ProfileViewModel] Profile refreshed:', value);
            updateProfileState(value.data);
          },
          error: (error) => {
            console.error('[ProfileViewModel] Error refreshing profile:', error);
            setErrorMessage('Error al actualizar el perfil.');
          },
        });
    }, 100);
  }, [authUserService, destroy$, updateProfileState]);

  /**
   * Logs out the user and navigates to login screen.
   */
  const logout = useCallback(async () => {
    try {
      console.log('[ProfileViewModel] Logging out...');
      await authUserService.logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('[ProfileViewModel] Error during logout:', error);
      setErrorMessage('Error al cerrar sesión.');
    }
  }, [authUserService]);

  /**
   * Clears the error message.
   */
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  // Load profile on mount
  useEffect(() => {
    loadProfileFromStorage();

    // Cleanup on unmount
    return () => {
      destroy$.next();
      destroy$.complete();
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [loadProfileFromStorage, destroy$]);

  return {
    // State
    profileImage,
    username,
    memberSince,
    learningPoints,
    isLoading,
    isRefreshing,
    errorMessage,
    // Actions
    refreshProfile,
    logout,
    clearError,
  };
};

export default useProfileViewModel;
