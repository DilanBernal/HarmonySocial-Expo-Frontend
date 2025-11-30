import { HttpRequest } from '../models/http/HttpRequest';
import { Observable } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { catchError, switchMap } from 'rxjs/operators';

export default class HttpClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private interceptors: ((req: HttpRequest) => Observable<HttpRequest>)[];

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.interceptors = [];
  }

  addInterceptor(interceptor: (req: HttpRequest) => Observable<HttpRequest>): void {
    this.interceptors.push(interceptor);
  }

  private applyInterceptors(request: HttpRequest): Observable<HttpRequest> {
    return this.interceptors.reduce<Observable<HttpRequest>>(
      (req$, interceptor) => req$.pipe(switchMap(interceptor)),
      new Observable<HttpRequest>(observer => {
        observer.next(request);
        observer.complete();
      })
    );
  }

  private request<T>(
    method: string,
    url: string,
    options: RequestInit = {}
  ): Observable<T> {
    const fullUrl = `${this.baseUrl}${url}`;

    const request: HttpRequest = {
      url: fullUrl,
      headers: {
        ...this.defaultHeaders,
        ...(options.headers as Record<string, string>),
      },
      body: options.body,
      method,
    };

    return this.applyInterceptors(request).pipe(
      switchMap(interceptedRequest => {
        const { url, headers, body, method } = interceptedRequest;
        const requestOptions: RequestInit = {
          method,
          headers,
          body,
        };

        return fromFetch(url, requestOptions).pipe(
          switchMap(async (response) => {
            if (!response.ok) {
              throw new Error(`HTTP Error: ${response.status}`);
            }
            return (await response.json()) as T;
          }),
          catchError((error) => {
            throw new Error(`HTTP Error: ${error.message}`);
          })
        );
      })
    );
  }

  get<T>(url: string, headers?: Record<string, string>): Observable<T> {
    return this.request<T>('GET', url, { headers });
  }

  post<T>(url: string, body: any, headers?: Record<string, string>): Observable<T> {
    return this.request<T>('POST', url, {
      body: JSON.stringify(body),
      headers,
    });
  }

  put<T>(url: string, body?: any, headers?: Record<string, string>): Observable<T> {
    return this.request<T>('PUT', url, {
      body: JSON.stringify(body),
      headers,
    });
  }

  delete<T>(url: string, headers?: Record<string, string>): Observable<T> {
    return this.request<T>('DELETE', url, { headers });
  }
}
