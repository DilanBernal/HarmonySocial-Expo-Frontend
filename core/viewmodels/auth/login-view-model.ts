import LoginDTO from '@/core/dtos/LoginDTO';
import LoginResponse from '@/core/dtos/responses/LoginResponse';
import AuthUserService from '@/core/services/AuthUserService';
import { loginValidationSchema } from '@/core/types/schemas/loginValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { catchError, finalize, of } from 'rxjs';

const useLoginViewModel = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const authService: AuthUserService = new AuthUserService();
  const router = useRouter();
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

  const onSubmit = () => {
    setIsLoading(true);

    try {
      const userLoginForm: LoginDTO = {
        userOrEmail: getValues('userOrEmail'),
        password: getValues('password'),
      };
      console.log(userLoginForm);

      authService
        .login(userLoginForm)
        .pipe(
          catchError((err) => {
            console.log(err);
            return of();
          }),
          finalize(() => {
            setIsLoading(false);
          })
        )
        .subscribe({
          next: async (response) => {
            const data: LoginResponse = response.data;
            if (response) {
              await SecureStore.setItemAsync('user_token', data.data.token);
              const userToSave: {
                username: string;
                id: number;
                profile_image: string;
              } = {
                ...data.data,
              };
              await AsyncStorage.setItem(
                'user_login_data',
                JSON.stringify(userToSave)
              );
              await authService.setAsyncUserData(
                undefined,
                undefined,
                response.data
              );
              router.replace('/main/feed');
            }
          },
          error: (registrationError) => {
            console.error('Registration error:', registrationError);
            setIsLoading(false);
          },
        });
    } catch (syncError) {
      console.error('Sync registration error:', syncError);
      setIsLoading(false);
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    getFieldState,
    getValues,
    errors,
    setValue,
    reset,
    isLoading,
  };
};
export default useLoginViewModel;
