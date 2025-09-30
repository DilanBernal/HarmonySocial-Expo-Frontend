import { forgotValidationSchema } from '@/core/types/schemas/fogotValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const useForgotPasswordViewModel = () => {
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
    resolver: yupResolver(forgotValidationSchema),
    mode: 'onChange',
    delayError: 0,
  });

  useEffect(() => {}, []);

  return { control };
};

export default useForgotPasswordViewModel;
