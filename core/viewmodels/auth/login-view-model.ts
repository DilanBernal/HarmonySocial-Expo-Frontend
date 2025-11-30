import LoginDTO from '@/core/dtos/LoginDTO';
import { LoginResponseData } from '@/core/dtos/responses/LoginResponse';
import AuthUserService from '@/core/services/AuthUserService';
import { loginValidationSchema } from '@/core/types/schemas/loginValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Subject, Subscription } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Error messages mapping
const ERROR_MESSAGES: Record<string, string> = {
  'HTTP Error: 401': 'Usuario o contraseña incorrectos.',
  'HTTP Error: 403': 'Tu cuenta ha sido bloqueada. Contacta al soporte.',
  'HTTP Error: 404': 'No se encontró el usuario.',
  'HTTP Error: 500': 'Error del servidor. Intenta más tarde.',
  'HTTP Error: 503': 'Servicio no disponible. Intenta más tarde.',
  'Network Error': 'Error de conexión. Verifica tu internet.',
  default: 'Ocurrió un error inesperado. Intenta nuevamente.',
};

/**
 * Maps error messages to user-friendly Spanish messages.
 */
const mapErrorMessage = (errorMessage: string): string => {
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }
  return ERROR_MESSAGES.default;
};

/**
 * Login ViewModel - Manages the login screen state and logic following MVVM pattern.
 * Uses RxJS for reactive data handling.
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

    subscriptionRef.current = authService
      .login(userLoginForm)
      .pipe(
        takeUntil(destroy$),
        catchError((error) => {
          const errorMsg = mapErrorMessage(error.message);
          console.error('[LoginViewModel] Login failed:', errorMsg);
          return throwError(() => new Error(errorMsg));
        }),
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
   * Submit handler for login.
   * Uses isLoading state to prevent multiple submissions.
   */
  const onSubmit = useCallback(() => {
    // Prevent multiple submissions while loading
    if (isLoading) {
      console.log('[LoginViewModel] Already loading, ignoring submit');
      return;
    }

    // Clear previous error and start loading
    setErrorMessage(null);
    setIsLoading(true);
    performLogin();
  }, [isLoading, performLogin]);

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
