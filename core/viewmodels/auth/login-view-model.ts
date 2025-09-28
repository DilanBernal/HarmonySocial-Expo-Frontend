import LoginDTO from "@/core/dtos/LoginDTO";
import AuthUserService from "@/core/services/AuthUserService";
import { loginValidationSchema } from "@/core/types/schemas/loginValidationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";

const useLoginViewModel = () => {
 const [isLoading, setIsLoading] = useState<boolean>(false);
 const [error, setError] = useState<string | null>(null);
 const authService: AuthUserService = new AuthUserService();
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
  mode: "onChange",
  delayError: 10,
 });

 const onSubmit = () => {
  console.log("Sending register petition");
  setIsLoading(true);
  setError(null);

  try {
   const userLoginForm: LoginDTO = {
    userOrEmail: getValues("userOrEmail"),
    password: getValues("password"),
   };

   authService.login(userLoginForm).subscribe({
    next: (response) => {
     console.log("Registration successful:", response);
     setIsLoading(false);

     // Aquí podrías redirigir al login o mostrar mensaje de éxito
     // navigation.navigate('Login');
    },
    error: (registrationError) => {
     console.error("Registration error:", registrationError);
     setError(registrationError.message || "Error en el registro");
     setIsLoading(false);
    },
   });
  } catch (syncError) {
   console.error("Sync registration error:", syncError);
   setError("Error preparando los datos de registro");
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
  error,
 };
};
export default useLoginViewModel;
