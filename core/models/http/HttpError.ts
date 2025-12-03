import { HttpResponse } from "@/core/http";

export default class HttpError extends Error {
  public readonly timestamp: Date;
  public readonly requestUrl?: string;

  constructor(public readonly response: HttpResponse<any>) {
    super(`HTTP Error ${response.status}: ${response.statusText}`);

    this.name = 'HttpError';
    this.timestamp = new Date();
    this.requestUrl = response.url;

    // ✅ MANTIENE EL STACK TRACE CORRECTO
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }

  // ✅ MÉTODOS ÚTILES PARA VERIFICAR TIPOS DE ERROR
  isClientError(): boolean {
    return this.response.status >= 400 && this.response.status < 500;
  }

  isServerError(): boolean {
    return this.response.status >= 500;
  }

  isNetworkError(): boolean {
    return this.response.status === 0;
  }

  getErrorMessage(): string {
    if (this.isNetworkError()) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }

    const body = this.response.body;
    if (body && typeof body === 'object' && 'message' in body && typeof (body.message) == "string") {
      return body.message;
    }

    return this.response.statusText || 'Error desconocido';
  }

  // ✅ MÉTODO PARA LOGGING
  toLogString(): string {
    return `[${this.timestamp.toISOString()}] ${this.name}: ${this.message} (URL: ${this.requestUrl})`;
  }
}