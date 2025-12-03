import { forkJoin, Observable, of, Subject } from 'rxjs';
import { AxiosInstance } from 'axios';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import { Axios } from 'rxjs-axios';
import { HttpResponse } from '@/core/types/HttpResponse';
import SearchResponse from '@/core/models/data/SearchResposne';
import User from '@/core/models/data/User';
import Artist from '@/core/models/data/Artist';
import { Song } from '@/core/models/data/Song';
import UserBasicData from '@/core/dtos/user/UserBasicData';

export class SearchService {
  private httpClient: Axios;
  private searchSubject = new Subject<string>();
  private lastSearchResults: SearchResponse = {
    users: [],
    artists: [],
    songs: [],
  };

  constructor() {
    this.httpClient = Axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL
    });

    // Setup debounced search
    this.setupDebouncedSearch();
  }

  private setupDebouncedSearch() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.searchAll(query))
      )
      .subscribe({
        next: (results) => {
          this.lastSearchResults = results;
        },
        error: (error) => {
          console.error('Debounced search error:', error);
        },
      });
  }

  public searchAll(query: string): Observable<SearchResponse> {
    const q = query.trim();
    if (!q) {
      return of({ users: [], artists: [], songs: [] });
    }

    console.log('Starting search for:', q);

    const optimizedSearch = this.httpClient
      .get<any>(`/search?searchBy=${encodeURIComponent(q)}&limit=10`)
      .pipe(
        catchError(err => {
          console.error(err);
          return of({ data: { users: [], artists: [], songs: [] } });
        }),
        map((responseNoForma) => {
          if (responseNoForma.data) {
            return responseNoForma.data;
          }
        }),
        map((response) => {
          console.log(response);
          debugger;
          const uRows: Array<UserBasicData> = response.users;
          const aRows: Array<Artist> = response.artists;
          const sRows: Array<Song> = response.songs;

          if (uRows.length >= 0 || aRows.length >= 0 || sRows.length >= 0) {
            console.log('[Search] Optimized results:', {
              users: uRows.length,
              artists: aRows.length,
              songs: sRows.length,
            });
            return { users: uRows, artists: aRows, songs: sRows };
          }

          throw new Error('No results from optimized search');
        })
      );


    return optimizedSearch;
  }

  // Método para búsqueda con debounce
  searchWithDebounce(query: string): void {
    this.searchSubject.next(query);
  }

  // Obtener los últimos resultados de búsqueda
  getLastSearchResults(): SearchResponse {
    return this.lastSearchResults;
  }

}

// Exportar instancia singleton
export const searchService = new SearchService();
