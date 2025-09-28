import { Observable } from "rxjs";
import LoginDTO from "../dtos/LoginDTO";
import { RegisterDTO } from "../dtos/RegisterDTO";
import LoginResponse from "../dtos/responses/LoginResponse";
import { httpClient } from "../http";
import { HttpResponse } from "../types/HttpResponse";

export default class AuthUserService {
 getToken() {
  return "";
 }

 login(data: LoginDTO): Observable<HttpResponse<LoginResponse>> {
  return httpClient.post("/users/login", data);
 }

 register(data: RegisterDTO): Observable<HttpResponse<any>> {
  return httpClient.post("users/register", data);
 }
}
