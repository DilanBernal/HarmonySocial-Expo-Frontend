export default interface LoginResponse {
  message: string;
  data: LoginResponseData;
}

export interface LoginResponseData {
  username: string;
  token: string;
  id: number;
  profile_image: string;
}