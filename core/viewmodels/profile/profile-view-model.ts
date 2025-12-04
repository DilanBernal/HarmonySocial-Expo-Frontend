import UserBasicData from '@/core/dtos/user/UserBasicData';
import AuthUserService from '@/core/services/seg/AuthUserService';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Subject, Subscription } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';

/**
 * Profile ViewModel - Manages the profile screen state and logic following MVVM pattern.
 * Uses RxJS for reactive data handling with proper cleanup.
 */
const useProfileViewModel = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string>('');
  const [memberSince, setMemberSince] = useState<string>('');
  const [learningPoints, setLearningPoints] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authUserService = useRef(AuthUserService).current;

  const destroy$ = useRef(new Subject<void>()).current;
  const subscriptionRef = useRef<Subscription | null>(null);

  const updateProfileState = useCallback((userData: UserBasicData) => {
    setUsername(userData.username || '');
    setProfileImage(userData.profileImage);
    setMemberSince(String(userData.activeFrom || ''));
    setLearningPoints(userData.learningPoints);
  }, []);

  const loadProfileFromStorage = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    subscriptionRef.current = authUserService
      .getDataInfoFromAsyncStorage()
      .pipe(
        takeUntil(destroy$),
        catchError(error => {
          console.log(error);
          setErrorMessage("Noje")

          throw error;
        }),
        finalize(() => {
          setIsLoading(false);
        }))
      .subscribe((userStorage) => {
        if (!userStorage) {
          console.error('[ProfileViewModel] Error loading profile:');
          setErrorMessage('Error al cargar el perfil.');
          logout();
          return;
        }
        console.log('[ProfileViewModel] User data from storage:', userStorage);

        updateProfileState(userStorage);
      });

  }, [authUserService, destroy$, updateProfileState]);

  /**
   * Refreshes profile data from the API.
   */
  const refreshProfile = useCallback(() => {
    setIsRefreshing(true);
    setErrorMessage(null);

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
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
          updateProfileState(value);
        },
        error: (error) => {
          console.error('[ProfileViewModel] Error refreshing profile:', error);
          setErrorMessage('Error al actualizar el perfil.');
        },
      });
  }, [authUserService, destroy$, updateProfileState]);

  const logout = useCallback(() => {
    try {
      console.log('[ProfileViewModel] Logging out...');
      authUserService.logout();
      setTimeout(() => {
        router.replace('/auth/login');
      }, 1000)
    } catch (error) {
      console.error('[ProfileViewModel] Error during logout:', error);
      setErrorMessage('Error al cerrar sesión.');
    }
  }, [authUserService, router]);

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
