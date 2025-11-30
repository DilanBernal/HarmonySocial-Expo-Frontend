import LoginDTO from '@/core/dtos/LoginDTO';
import LoginResponse from '@/core/dtos/responses/LoginResponse';
import { httpClient } from '@/core/http';
import { Observable, Subject, Subscription, throwError } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';

/**
 * Service responsible for handling login-related API requests.
 * Uses RxJS Observables for reactive data handling.
 */
export class LoginService {
  private loginSubject = new Subject<LoginDTO>();
  private loginResults$ = new Subject<LoginResponse>();
  private errorSubject = new Subject<string>();
  private loginStreamSubscription: Subscription | null = null;

  // Error messages mapping
  private static readonly ERROR_MESSAGES: Record<string, string> = {
    'HTTP Error: 401': 'Usuario o contraseña incorrectos.',
    'HTTP Error: 403': 'Tu cuenta ha sido bloqueada. Contacta al soporte.',
    'HTTP Error: 404': 'No se encontró el usuario.',
    'HTTP Error: 500': 'Error del servidor. Intenta más tarde.',
    'HTTP Error: 503': 'Servicio no disponible. Intenta más tarde.',
    'Network Error': 'Error de conexión. Verifica tu internet.',
    default: 'Ocurrió un error inesperado. Intenta nuevamente.',
  };

  constructor() {
    this.setupLoginStream();
  }

  /**
   * Sets up the login stream with debounce to prevent multiple rapid API calls.
   */
  private setupLoginStream(): void {
    this.loginStreamSubscription = this.loginSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(
          (prev, curr) =>
            prev.userOrEmail === curr.userOrEmail &&
            prev.password === curr.password
        ),
        switchMap((loginData) => this.performLogin(loginData))
      )
      .subscribe({
        next: (response) => {
          this.loginResults$.next(response);
        },
        error: (error) => {
          this.errorSubject.next(this.mapErrorMessage(error.message));
        },
      });
  }

  /**
   * Performs the actual login API call.
   * @param data - Login credentials
   * @returns Observable with login response
   */
  private performLogin(data: LoginDTO): Observable<LoginResponse> {
    return httpClient.post<LoginResponse>('/users/login', data).pipe(
      tap((response) => {
        console.log('[LoginService] Login successful:', response.message);
      }),
      catchError((error) => {
        const errorMessage = this.mapErrorMessage(error.message);
        console.error('[LoginService] Login failed:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Maps error messages to user-friendly Spanish messages.
   * @param errorMessage - Original error message
   * @returns User-friendly error message
   */
  private mapErrorMessage(errorMessage: string): string {
    for (const [key, value] of Object.entries(LoginService.ERROR_MESSAGES)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }
    return LoginService.ERROR_MESSAGES.default;
  }

  /**
   * Public method to initiate login with debounce.
   * @param data - Login credentials
   */
  public loginWithDebounce(data: LoginDTO): void {
    this.loginSubject.next(data);
  }

  /**
   * Direct login without debounce - returns an Observable.
   * @param data - Login credentials
   * @returns Observable with login response
   */
  public login(data: LoginDTO): Observable<LoginResponse> {
    return this.performLogin(data);
  }

  /**
   * Observable to subscribe to login results.
   * @returns Observable with login responses
   */
  public getLoginResults(): Observable<LoginResponse> {
    return this.loginResults$.asObservable();
  }

  /**
   * Observable to subscribe to error messages.
   * @returns Observable with error messages
   */
  public getErrors(): Observable<string> {
    return this.errorSubject.asObservable();
  }

  /**
   * Cleans up all subjects and subscriptions to prevent memory leaks.
   * Should be called when the service is no longer needed.
   */
  public destroy(): void {
    // Unsubscribe from the login stream first
    if (this.loginStreamSubscription) {
      this.loginStreamSubscription.unsubscribe();
      this.loginStreamSubscription = null;
    }
    // Then complete all subjects
    this.loginSubject.complete();
    this.loginResults$.complete();
    this.errorSubject.complete();
  }
}

// Export singleton instance
export const loginService = new LoginService();
