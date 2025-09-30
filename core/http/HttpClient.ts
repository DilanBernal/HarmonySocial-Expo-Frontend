import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, switchMap } from 'rxjs/operators';
import { HttpResponse } from '../types/HttpResponse';

export default class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    console.log(this.baseUrl);
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private request<T>(
    method: string,
    url: string,
    options: RequestInit = {}
  ): Observable<HttpResponse<T>> {
    const fullUrl = `${this.baseUrl}${url}`;

    const requestOptions: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      body: options.body,
    };

    console.log(fullUrl);
    return fromFetch(fullUrl, requestOptions).pipe(
      switchMap(async (response) => {
        const data = await response.json();
        return {
          data,
          status: response.status,
          headers: response.headers,
        } as HttpResponse<T>;
      }),
      catchError((error) => {
        throw new Error(`HTTP Error: ${error.message}`);
      })
    );
  }

  get<T>(
    url: string,
    headers?: Record<string, string>
  ): Observable<HttpResponse<T>> {
    return this.request<T>('GET', url, { headers });
  }

  post<T>(
    url: string,
    body: any,
    headers?: Record<string, string>
  ): Observable<HttpResponse<T>> {
    console.log(body);
    return this.request<T>('POST', url, {
      body: JSON.stringify(body),
      headers,
    });
  }

  put<T>(
    url: string,
    body?: any,
    headers?: Record<string, string>
  ): Observable<HttpResponse<T>> {
    return this.request<T>('PUT', url, {
      body: JSON.stringify(body),
      headers,
    });
  }

  delete<T>(
    url: string,
    headers?: Record<string, string>
  ): Observable<HttpResponse<T>> {
    return this.request<T>('DELETE', url, { headers });
  }

  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }
}
