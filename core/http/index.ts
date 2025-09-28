import HttpClient from './HttpClient';

// Configuración de la API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://fs571vhd-4666.use2.devtunnels.ms/api/';

// Instancia singleton
export const httpClient = new HttpClient(API_BASE_URL);

// Exportar también la clase por si necesitas crear instancias adicionales
export type { HttpResponse } from '../types/HttpResponse';
export { default as HttpClient } from './HttpClient';

