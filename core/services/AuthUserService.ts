import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Observable } from 'rxjs';
import LoginDTO from '../dtos/LoginDTO';
import { RegisterDTO } from '../dtos/RegisterDTO';
import LoginResponse from '../dtos/responses/LoginResponse';
import { httpClient } from '../http';
import { HttpResponse } from '../types/HttpResponse';

export default class AuthUserService {
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('user_token');
  }

  async logout() {
    await SecureStore.deleteItemAsync('user_token');
  }

  login(data: LoginDTO): Observable<HttpResponse<LoginResponse>> {
    return httpClient.post('/users/login', data);
  }

  register(data: RegisterDTO): Observable<HttpResponse<any>> {
    return httpClient.post('/users/register', data);
  }

  async getDataInfoFromAsyncStorage() {
    const userStorage = await AsyncStorage.getItem('user_data');
    const userToken = await this.getToken();
    if (userStorage && userToken) {
      console.log(JSON.parse(userStorage));
      return JSON.parse(userStorage);
    } else {
      this.logout();
      return;
    }
  }

  getDataInfoFromApi(): Observable<HttpResponse<any>> {
    return httpClient.get('');
  }
}
