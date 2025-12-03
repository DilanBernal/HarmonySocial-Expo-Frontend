import { AxiosRequestConfig } from 'rxjs-axios';
import AuthUserService from '@/core/services/seg/AuthUserService';
import { firstValueFrom } from 'rxjs';

export default async function AuthInterceptorRx(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
  try {
    if (!config.headers) config.headers = {};

    const token = AuthUserService.userTokenCache;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error('[AuthInterceptorRx] Error obteniendo token', err);
  }

  return config;
}