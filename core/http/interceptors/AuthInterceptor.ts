import { AxiosRequestConfig } from 'rxjs-axios';


export default function AuthInterceptor(config: AxiosRequestConfig, token: string): AxiosRequestConfig {
  debugger;

  if (token) {
    config.headers!.Authorization = token;
  }

  return config;
}