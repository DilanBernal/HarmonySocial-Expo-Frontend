import { PostPayload, PostEntity } from '@/core/types/post';
import { Observable } from 'rxjs';
import { Axios } from 'rxjs-axios';
import { map, catchError, tap } from 'rxjs/operators';
import AuthInterceptorRx from '@/core/http/interceptors/AuthInterceptorRx';

/**
 * Service for post-related API operations
 */
export class PostService {
  private httpClient;
  private axiosConfig;

  constructor() {
    this.axiosConfig = {
      baseURL: process.env.EXPO_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    this.httpClient = Axios.create(this.axiosConfig);
    // Add authentication interceptor
    this.httpClient.interceptors.request.use(AuthInterceptorRx);
  }

  /**
   * Creates a new post
   * @param payload - Post data to create
   * @returns Observable of created post entity
   */
  createPost(payload: PostPayload): Observable<PostEntity> {
    console.log('[PostService] Creating post:', payload);
    
    return this.httpClient
      .post<PostEntity>('/posts', payload)
      .pipe(
        map((response) => response.data),
        tap((post) => {
          console.log('[PostService] Post created successfully:', post);
        }),
        catchError((error) => {
          console.error('[PostService] Error creating post:', error);
          throw error;
        })
      );
  }
}

// Export singleton instance
export const postService = new PostService();
