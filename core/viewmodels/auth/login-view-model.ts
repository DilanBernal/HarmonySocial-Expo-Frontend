import LoginDTO from '@/core/dtos/LoginDTO';
import { LoginResponseData } from '@/core/dtos/responses/LoginResponse';
import AuthUserService from '@/core/services/AuthUserService';
import { loginService } from '@/core/services/auth/LoginService';
import { loginValidationSchema } from '@/core/types/schemas/loginValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';

/**
 * Login ViewModel - Manages the login screen state and logic following MVVM pattern.
 * Uses RxJS for reactive data handling with debounce to prevent multiple API calls.
 */
const useLoginViewModel = () => {
  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Services
  const authService = useRef(new AuthUserService()).current;
  const router = useRouter();

  // RxJS subjects for cleanup
  const destroy$ = useRef(new Subject<void>()).current;
  const loginClickSubject = useRef(new Subject<void>()).current;
  const subscriptionRef = useRef<Subscription | null>(null);

  // Form handling with react-hook-form
  const {
    control,
    reset,
    getFieldState,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    mode: 'onChange',
    delayError: 0,
  });

  /**
   * Clears the current error message.
   */
  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  /**
   * Performs the login API call with proper error handling.
   */
  const performLogin = useCallback(() => {
    const userLoginForm: LoginDTO = {
      userOrEmail: getValues('userOrEmail'),
      password: getValues('password'),
    };

    console.log('[LoginViewModel] Attempting login for:', userLoginForm.userOrEmail);

    // Clean up previous subscription if exists
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = loginService
      .login(userLoginForm)
      .pipe(
        takeUntil(destroy$),
        finalize(() => {
          setIsLoading(false);
        })
      )
      .subscribe({
        next: async (response) => {
          if (!response) {
            setErrorMessage('No se recibió respuesta del servidor.');
            return;
          }

          console.log('[LoginViewModel] Login successful:', response.message);
          const data: LoginResponseData = response.data;

          try {
            // Store token securely
            await SecureStore.setItemAsync('user_token', data.token);

            // Store user basic data
            const userToSave = {
              username: data.username,
              id: data.id,
              profile_image: data.profile_image,
            };
            await AsyncStorage.setItem(
              'user_login_data',
              JSON.stringify(userToSave)
            );

            // Set additional user data
            await authService.setAsyncUserData(undefined, undefined, response);

            // Clear any errors and navigate
            setErrorMessage(null);
            router.replace('/main/feed');
          } catch (storageError) {
            console.error('[LoginViewModel] Storage error:', storageError);
            setErrorMessage('Error al guardar los datos de sesión.');
          }
        },
        error: (error) => {
          console.error('[LoginViewModel] Login error:', error.message);
          setErrorMessage(error.message);
        },
      });
  }, [getValues, authService, router, destroy$]);

  /**
   * Submit handler with debounce to prevent multiple rapid submissions.
   * Uses RxJS debounceTime to ensure only one API call per 500ms.
   */
  const onSubmit = useCallback(() => {
    // Clear previous error
    setErrorMessage(null);
    setIsLoading(true);

    // Use debounce to prevent multiple rapid submissions
    const debounceSubscription = loginClickSubject
      .pipe(
        debounceTime(500),
        takeUntil(destroy$)
      )
      .subscribe(() => {
        performLogin();
      });

    // Trigger the debounced login
    loginClickSubject.next();

    // Clean up debounce subscription after a short delay
    setTimeout(() => {
      debounceSubscription.unsubscribe();
    }, 600);
  }, [loginClickSubject, destroy$, performLogin]);

  /**
   * Cleanup function to be called when the component unmounts.
   */
  const cleanup = useCallback(() => {
    destroy$.next();
    destroy$.complete();
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }
  }, [destroy$]);

  return {
    // Form controls
    control,
    handleSubmit,
    getFieldState,
    getValues,
    errors,
    setValue,
    reset,
    // State
    isLoading,
    errorMessage,
    // Actions
    onSubmit,
    clearError,
    cleanup,
  };
};

export default useLoginViewModel;
