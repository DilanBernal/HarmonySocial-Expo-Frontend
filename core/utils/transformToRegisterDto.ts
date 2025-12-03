import { RegisterDTO } from '../dtos/RegisterDTO';
import { RegisterFormData } from '../dtos/RegisterFormData';

export const transformToRegisterDTO = (
  formData: RegisterFormData
): RegisterDTO => {
  console.log(formData);
  if (
    formData.favoriteInstrument === undefined ||
    formData.favoriteInstrument === null
  ) {
    throw new Error('Favorite instrument is required');
  }
  if (formData.password !== formData.confirmPassword) {
    throw new Error('The passwords not match');
  }

  return {
    fullName: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    username: formData.username.trim(),
    password: formData.password,
    profileImage: formData.profileImage,
    favoriteInstrument: formData.favoriteInstrument,
  };
};
