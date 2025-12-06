import * as Yup from 'yup';
import { PostCategory } from '@/core/types/post';

/**
 * Validation schema for Step 1: Category and basic information
 */
export const step1ValidationSchema = Yup.object({
  category: Yup.mixed<PostCategory>()
    .oneOf(['music', 'text', 'image', 'video'], 'Selecciona una categoría válida')
    .required('La categoría es obligatoria'),
  title: Yup.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres')
    .required('El título es obligatorio'),
  short_description: Yup.string()
    .min(10, 'La descripción corta debe tener al menos 10 caracteres')
    .max(150, 'La descripción corta no puede exceder 150 caracteres')
    .required('La descripción corta es obligatoria'),
});

/**
 * Validation schema for Step 2: Content based on category
 */
export const step2ValidationSchema = Yup.object({
  category: Yup.mixed<PostCategory>().required(),
  description: Yup.string().when('category', {
    is: (val: PostCategory) => val === 'music' || val === 'text',
    then: (schema) =>
      schema
        .min(20, 'La descripción debe tener al menos 20 caracteres')
        .max(5000, 'La descripción no puede exceder 5000 caracteres')
        .required('La descripción es obligatoria para esta categoría'),
    otherwise: (schema) =>
      schema.max(5000, 'La descripción no puede exceder 5000 caracteres'),
  }),
  song_id: Yup.number().when('category', {
    is: 'music',
    then: (schema) =>
      schema
        .positive('Selecciona una canción válida')
        .required('Debes seleccionar una canción para posts de música'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

/**
 * Complete validation schema for the entire form
 */
export const completePostValidationSchema = Yup.object({
  category: Yup.mixed<PostCategory>()
    .oneOf(['music', 'text', 'image', 'video'], 'Selecciona una categoría válida')
    .required('La categoría es obligatoria'),
  title: Yup.string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres')
    .required('El título es obligatorio'),
  short_description: Yup.string()
    .min(10, 'La descripción corta debe tener al menos 10 caracteres')
    .max(150, 'La descripción corta no puede exceder 150 caracteres')
    .required('La descripción corta es obligatoria'),
  description: Yup.string().when('category', {
    is: (val: PostCategory) => val === 'music' || val === 'text',
    then: (schema) =>
      schema
        .min(20, 'La descripción debe tener al menos 20 caracteres')
        .max(5000, 'La descripción no puede exceder 5000 caracteres')
        .required('La descripción es obligatoria para esta categoría'),
    otherwise: (schema) =>
      schema.max(5000, 'La descripción no puede exceder 5000 caracteres'),
  }),
  song_id: Yup.number().when('category', {
    is: 'music',
    then: (schema) =>
      schema
        .positive('Selecciona una canción válida')
        .required('Debes seleccionar una canción para posts de música'),
    otherwise: (schema) => schema.notRequired(),
  }),
});
