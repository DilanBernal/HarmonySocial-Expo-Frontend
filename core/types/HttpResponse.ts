export interface HttpResponse<T> extends Response {
  data: T;
  headers: Headers;
}
