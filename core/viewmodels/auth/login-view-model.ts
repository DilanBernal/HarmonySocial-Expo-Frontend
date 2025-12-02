import LoginDTO from '@/core/dtos/LoginDTO';
import { LoginResponseData } from '@/core/dtos/responses/LoginResponse';
import AuthUserService from '@/core/services/seg/AuthUserService';
import { loginValidationSchema } from '@/core/types/schemas/loginValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Subject, Subscription } from 'rxjs';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { isAxiosError } from 'axios';

const useLoginViewModel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canLogin, setCanLogin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authService = useRef(AuthUserService).current;
  const router = useRouter();

  const destroy$ = useRef(new Subject<void>()).current;
  const subscriptionRef = useRef<Subscription | null>(null);

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

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const performLogin = useCallback(() => {
    const userLoginForm: LoginDTO = {
      userOrEmail: getValues('userOrEmail'),
      password: getValues('password'),
    };

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    subscriptionRef.current = authService
      .login(userLoginForm)
      .pipe(
        takeUntil(destroy$),
        catchError((error) => {
          if (isAxiosError(error)) {
            if (!error.response) {
              return throwError(() => new Error("No se obtuvo respuesta de el servidor"));
            }
            switch (error.response.status) {
              case 401:
                return throwError(() => new Error("Credenciales invalidas"));
              case 404:
                return throwError(() => new Error("No se obtuvo respuesta de el servidor"));
              case 500:
                return throwError(() => new Error(error.response?.data.message));
              default:
                return throwError(() => error);
            }
          }
          console.error('[LoginViewModel] Login failed:', error);
          return throwError(() => error);
        }),
        finalize(() => {
          setIsLoading(false);
        })
      )
      .subscribe({
        next: (response) => {
          if (!response) {
            setErrorMessage('No se recibió respuesta del servidor.');
            return;
          }

          const data: LoginResponseData = response.data;

          authService.setAsyncUserData(undefined, undefined, response);
          setErrorMessage(null);
          router.replace('/main/feed');
        },
        error: (error) => {
          console.error('[LoginViewModel] Login error:', error.message);
          setErrorMessage(error.message);
        },
      });
  }, [getValues, authService, router, destroy$]);

  const verifyExistingLogin = useCallback(() => {
    const token = authService.userTokenCache;
    if (token) {
      setCanLogin(false);
      router.replace('/main/feed');
      return;
    } else {
      authService.getTokenFromAsyncStorage().subscribe((tokenInAS: string | null) => {
        if (tokenInAS) {
          setCanLogin(false);
          router.replace('/main/feed');
          return;
        }
        setCanLogin(true);
      })
    }
  }, [setCanLogin, router, authService]);

  const onSubmit = useCallback(() => {
    if (isLoading) {
      console.log('[LoginViewModel] Already loading, ignoring submit');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    performLogin();
  }, [isLoading, performLogin]);


  useEffect(() => {
    verifyExistingLogin();
  }, []);

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
    canLogin,
    // Actions
    onSubmit,
    clearError,
    cleanup,
  };
};

export default useLoginViewModel;
