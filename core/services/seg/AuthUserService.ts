import User from '@/core/models/data/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { from, map, Observable } from 'rxjs';
import LoginDTO from '../../dtos/LoginDTO';
import { RegisterDTO } from '../../dtos/RegisterDTO';
import LoginResponse from '../../dtos/responses/LoginResponse';
import UserBasicData from '../../dtos/user/UserBasicData';
import { httpClient } from '../../http';
import { HttpResponse } from '../../types/HttpResponse';

const SECURE_STORE_TOKEN_KEY = 'user_token';
const ASYNC_STORAGE_USER_DATA_KEY = 'user_data';
3
export default class AuthUserService {
  private id: number = -1;

  public get userId(): number {
    return this.id;
  }

  getToken(): Observable<string | null> {
    return from(SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY)).pipe(map(value => {
      if (!value) return null;
      return JSON.parse(value);
    }));
  }

  logout(): void {
    SecureStore.deleteItemAsync(SECURE_STORE_TOKEN_KEY)
      .then(console.log)
      .catch(err => { console.error(err) });
    AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY)
      .then(console.log)
      .catch((er) => { console.error(er) });
  }

  login(data: LoginDTO): Observable<LoginResponse> {
    return httpClient.post('/users/login', data);
  }

  register(data: RegisterDTO): Observable<any> {
    return httpClient.post('/users/register', data);
  }

  async getDataInfoFromAsyncStorage() {
    const userStorage = await AsyncStorage.getItem(ASYNC_STORAGE_USER_DATA_KEY);
    const userToken = this.getToken();
    console.log(userStorage, userToken)
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

  getDataInfoFromApi(): Observable<HttpResponse<UserBasicData>> {
    // this.getIdSyncFromAsyncStorage()
    return httpClient.get(`/users/basic-info?id=${this.id}`);
  }

  setAsyncUserData(
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

    const setIdToSearch = (): number => {
      if (idToSearch) return idToSearch;
      if (loginResponse && loginResponse.data.id) return loginResponse.data.id;
      if (partialUserData?.id) return partialUserData.id;
      return NaN;
    }

    const idToSearch: number = setIdToSearch();
    if (isNaN(idToSearch)) {
      this.id = idToSearch;
    }

    if (loginResponse) {
      httpClient
        .get<UserBasicData>(`/users/basic-info?id=${loginResponse.data.id}`)
        .subscribe((value: UserBasicData) => {
          console.log(value);
          userData = { ...value };
          console.log(userData);
          AsyncStorage.setItem(ASYNC_STORAGE_USER_DATA_KEY, JSON.stringify(userData));
        },
        );
      return;
    }

    if (partialUserData?.id) {
    }

    if (id && id > 0) {
      httpClient.get(`/users/basic-info?id=${id}`).subscribe((x) => {
        console.log(x);
      });
    }
  }
}
