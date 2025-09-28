import * as Yup from "yup";

// Esquemas de validación por paso
export const loginValidationSchema = Yup.object({
 userOrEmail: Yup.string()
  .required("El username es obligatorio")
  .min(3, "Mínimo 3 caracteres")
  .max(20, "Máximo 20 caracteres")
  .matches(
   /^[a-zA-Z0-9_*\-#$!|°.+]{3,20}$/,
   "El usuario o correo está en formato incorrecto"
  ),
 password: Yup.string()
  .min(8, "Mínimo 8 caracteres")
  .required("La contraseña es obligatoria")
  .matches(
   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])(.){8,}$/,
   "La contraseña debe tener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial"
  ),
});
