import User from '@/core/models/data/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Observable } from 'rxjs';
import LoginDTO from '../dtos/LoginDTO';
import { RegisterDTO } from '../dtos/RegisterDTO';
import LoginResponse from '../dtos/responses/LoginResponse';
import UserBasicData from '../dtos/user/UserBasicData';
import { httpClient } from '../http';
import { HttpResponse } from '../types/HttpResponse';

export default class AuthUserService {
  private id: number = -1;

  public get userId(): number {
    return this.id;
  }

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('user_token');
  }

  async logout() {
    await SecureStore.deleteItemAsync('user_token');
    await AsyncStorage.removeItem('user_data');
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
      const dataParsed = JSON.parse(userStorage);
      console.log(dataParsed);
      this.id = dataParsed.id;
      return dataParsed;
    } else {
      this.logout();
      return;
    }
  }

  getIdSyncFromAsyncStorage() {
    AsyncStorage.getItem('user_data').then((x) => {
      const id = JSON.parse(x!).id;
      this.id = id;
      return id;
    });
  }

  getDataInfoFromApi(): Observable<HttpResponse<UserBasicData>> {
    this.getIdSyncFromAsyncStorage();
    return httpClient.get(`/users/basic-info?id=${this.id}`);
  }

  async setAsyncUserData(
    id?: number,
    partialUserData?: Partial<User>,
    loginResponse?: LoginResponse
  ) {
    let userData: UserBasicData = {
      id: id ?? -1,
      fullName: partialUserData?.full_name ?? '',
      email: partialUserData?.email ?? '',
      activeFrom: 0,
      profileImage: loginResponse?.data.profile_image ?? '',
      username: partialUserData?.username ?? '',
      learningPoints: 0,
      favoriteInstrument: partialUserData?.favorite_instrument ?? -1,
    };

    if (loginResponse) {
      httpClient
        .get<UserBasicData>(`/users/basic-info?id=${loginResponse.data.id}`)
        .subscribe({
          next: async (value: HttpResponse<UserBasicData>) => {
            console.log(value);
            userData = { ...value.data };
            console.log(userData);
            await AsyncStorage.setItem('user_data', JSON.stringify(userData));
          },
        });
      return;
    }

    if (partialUserData?.id) {
      httpClient
        .get(`/users/basic-info?id=${partialUserData.id}`)
        .subscribe((x) => {
          console.log(x);
        });
      return;
    }

    if (id && id > 0) {
      httpClient.get(`/users/basic-info?id=${id}`).subscribe((x) => {
        console.log(x);
      });
    }
  }
}
