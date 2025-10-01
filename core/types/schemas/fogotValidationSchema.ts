import * as Yup from 'yup';

export const forgotValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('El email es obligatorio'),
});
