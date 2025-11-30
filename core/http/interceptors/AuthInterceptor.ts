import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import AuthUserService from '@/core/services/AuthUserService';
import { HttpRequest } from '@/core/models/http/HttpRequest';

const excludedRoutes = ['/users/login', '/users/register', '/users/forgot-password'];


export default function AuthInterceptor(request: HttpRequest, authService: AuthUserService): Observable<HttpRequest> {
  // const authService = new AuthUserService();

  // Verificar si la ruta está excluida
  if (excludedRoutes.some(route => request.url.includes(route))) {
    return new Observable(observer => {
      observer.next(request);
      observer.complete();
    });
  }

  // Obtener el token y adjuntarlo
  return from(authService.getToken()).pipe(
    map((token: string | null) => {
      if (!token) {
        throw new Error('NoTokenError: No se encontró un token para esta solicitud.');
      }

      return {
        ...request,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    })
  );
}