import * as Yup from 'yup';

// Esquemas de validación por paso
export const postValidationSchema = Yup.object({
  title: Yup.string()
    .required('El titulo del post es obligatorio')
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .matches(
      /^[a-zA-Z0-9_*\-#$!|°.+]{3,20}$/,
      'El usuario o correo está en formato incorrecto'
    ),
});
