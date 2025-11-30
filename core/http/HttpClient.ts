import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpRequest } from '../models/http/HttpRequest';
import { from, Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, map, switchMap } from 'rxjs/operators';
import HttpError from '../models/http/HttpError';
import { HttpResponse } from '../types/HttpResponse';

export default class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private axiosInstance: AxiosInstance;
  private interceptors: ((req: HttpRequest) => Observable<HttpRequest>)[];

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: this.defaultHeaders
    });
    this.interceptors = [];
    this.setupInterceptors();
  }



  private setupInterceptors(): void {
    // Interceptor de request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🔄 Enviando request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Error en request:', error);
        return Promise.reject(error);
      }
    );


    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ Response recibido: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Error en response:', error.response?.status, error.message);
        return Promise.reject(error);
      }
    );
  }


  addInterceptor(interceptor: (req: HttpRequest) => Observable<HttpRequest>): void {
    this.interceptors.push(interceptor);
  }

  // Métodos principales que devuelven Observables
  public get<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return this.request<T>('GET', url, null, config);
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return this.request<T>('POST', url, data, config);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Observable<T> {
    return this.request<T>('PUT', url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Observable<T> {
    return this.request<T>('DELETE', url, null, config);
  }

  // Método genérico para todas las requests
  private request<T>(
    method: string,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Observable<T> {
    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      data,
      ...config,
    };

    return from(this.axiosInstance.request<T>(requestConfig)).pipe(
      map((response: AxiosResponse<T>) => response.data),
      catchError((error) => {
        // Aquí puedes transformar el error como necesites
        throw this.handleError(error);
      })
    );
  }


  private handleError(error: any) {
    console.log(error);
    throw new Error(error);
  }
}