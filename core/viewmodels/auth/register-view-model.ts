import { RegisterDTO } from '@/core/dtos/RegisterDTO';
import { RegisterFormData } from '@/core/dtos/RegisterFormData';
import AuthUserService from '@/core/services/seg/AuthUserService';
import { completeValidationSchemas } from '@/core/types/schemas/stepValidationSchemas';
import { UseRegisterViewModelReturn } from '@/core/types/viewmodels/RegisterViewModelTypes';
import { transformToRegisterDTO } from '@/core/utils/transformToRegisterDto';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export const useRegisterViewModel = (): UseRegisterViewModelReturn => {
  const {
    control,
    reset,
    getFieldState,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(completeValidationSchemas),
    mode: 'onChange',
    delayError: 0,
  });

  const UserService: AuthUserService = new AuthUserService();

  const onSubmit = async () => {
    console.log('sending register petition');
    try {
      const userRegisterForm: RegisterFormData = {
        fullName: getValues('fullName'),
        username: getValues('username'),
        email: getValues('email'),
        password: getValues('password'),
        confirmPassword: getValues('confirmPassword'),
        favoriteInstrument: getValues('favoriteInstrument'),
        profileImage: getValues('profileImage'),
      };
      const userDTO: RegisterDTO = transformToRegisterDTO(userRegisterForm);

      const serviceResponse = await UserService.register(userDTO);

      console.log(serviceResponse);
    } catch (error) {
      console.error(error);
      throw error;
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
  };
};
