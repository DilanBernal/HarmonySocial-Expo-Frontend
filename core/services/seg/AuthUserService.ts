import User from '@/core/models/data/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { catchError, from, map, Observable, of, tap } from 'rxjs';
import LoginDTO from '../../dtos/LoginDTO';
import { RegisterDTO } from '../../dtos/RegisterDTO';
import LoginResponse from '../../dtos/responses/LoginResponse';
import UserBasicData from '../../dtos/user/UserBasicData';
import { Axios } from 'rxjs-axios';
import AuthInterceptor from '@/core/http/interceptors/AuthInterceptor';


export class AuthUserService {
  private static instance: AuthUserService
  readonly SECURE_STORE_TOKEN_KEY = 'user_token';
  readonly ASYNC_STORAGE_USER_DATA_KEY = 'user_data';
  private id: number = -1;
  public userTokenCache!: string | null;
  private httpClient;
  private axiosConfig;

  constructor() {
    this.axiosConfig = {
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      headers: {
        "Content-Type": 'application/json'
      }
    };
    this.httpClient = Axios.create(this.axiosConfig);
  }

  public static getInstance(): AuthUserService {
    if (!AuthUserService.instance) {
      AuthUserService.instance = new AuthUserService();
    }
    return AuthUserService.instance;
  }

  public get userId(): number {
    return this.id;
  }

  getTokenFromAsyncStorage(): Observable<string | null> {
    return from(SecureStore.getItemAsync(this.SECURE_STORE_TOKEN_KEY))
      .pipe(catchError((err) => {
        console.error(err);
        return of(null);
      }), tap((x) => this.userTokenCache = x)
      );
  }

  logout(): void {
    SecureStore.deleteItemAsync(this.SECURE_STORE_TOKEN_KEY)
      .then(console.log)
      .catch(err => { console.error(err) });
    AsyncStorage.removeItem(this.ASYNC_STORAGE_USER_DATA_KEY)
      .then(console.log)
      .catch((er) => { console.error(er) });
  }

  login(data: LoginDTO): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>('/users/login', data).pipe(map((x) => {
      return x.data;
    }));
  }

  register(data: RegisterDTO): Observable<any> {
    return this.httpClient.post('/users/register', data);
  }

  getDataInfoFromAsyncStorage(): Observable<UserBasicData> {
    debugger;
    return from(AsyncStorage.getItem(this.ASYNC_STORAGE_USER_DATA_KEY)).pipe(map((value) => {
      if (!value || value.trim() === "") {
        throw new Error("No se pudo traer los datos del usuario");
      }
      const userDataFromJson: UserBasicData = JSON.parse(value);
      return userDataFromJson;
    }));
  }

  getDataInfoFromApi(): Observable<UserBasicData> {

    const config = { ...this.axiosConfig };

    const interceptedConfig = AuthInterceptor(config, this.userTokenCache!)
    return this.httpClient.get<UserBasicData>(`/users/basic-info?id=${this.id}`, interceptedConfig)
      .pipe(map(x => {
        debugger;
        return x.data;
      }));
  }

  setAsyncUserData(
    id?: number,
    partialUserData?: Partial<User>,
    loginResponse?: LoginResponse
  ) {

    const setIdToSearch = (): number => {
      if (id) return id;
      if (loginResponse && loginResponse.data.id) return loginResponse.data.id;
      if (partialUserData?.id) return partialUserData.id;
      return NaN;
    }

    let userData: UserBasicData = {
      id: setIdToSearch(),
      activeFrom: 0,
      profileImage: loginResponse?.data.profile_image ?? '',
      username: partialUserData?.username ?? '',
      learningPoints: 0,
      favoriteInstrument: partialUserData?.favoriteInstrument ?? -1,
    };


    const idToSearch: number = setIdToSearch();
    if (isNaN(idToSearch)) {
      this.logout();
      return;
    }
    this.id = idToSearch;

    if (loginResponse) {
      this.setTokenInAsyncStorage(loginResponse.data.token);
    }


    debugger;
    this.getDataInfoFromApi()
      .pipe(catchError(err => {
        debugger;
        throw err;
      }))
      .subscribe(async (value: UserBasicData) => {
        console.log(value);
        userData = { ...value };
        console.log(userData);
        debugger;
        await AsyncStorage.setItem(this.ASYNC_STORAGE_USER_DATA_KEY, JSON.stringify(userData));
        debugger;
      },
      );
    return;
  }

  setTokenInAsyncStorage(token: string): void {
    this.userTokenCache = token;
    debugger;
    SecureStore.setItemAsync(this.SECURE_STORE_TOKEN_KEY, token)
      .then(async () => {
        console.log(await SecureStore.getItemAsync(this.SECURE_STORE_TOKEN_KEY))
      })
      .then(() => { console.log("El token se guardo correctamente") })
      .catch((err) => {
        this.logout();
        throw err;
      });
  }
}

export default AuthUserService.getInstance();
