export interface HttpRequest {
  url: string;
  headers: Record<string, string>;
  body?: any;
  method: string;
}