export interface ReqOptions {
  baseURL: string;
  endpoint: string;
  params?: any;
  data?: any;
  headers?: Record<string, string>;
}

export interface Response<T> {
  status: number;
  message?: string;
  data?: T; 
}
interface iDelete {
  delete<T>(option: ReqOptions): Promise<Response<T>>;
}

interface iGet {
  get<T>(option: ReqOptions): Promise<Response<T>>;
}
interface iPost {
  post<T>(option: ReqOptions): Promise<Response<T>>;
}

interface iPut {
  put<T>(option: ReqOptions): Promise<Response<T>>;
}

interface iPatch {
  patch<T>(option: ReqOptions): Promise<Response<T>>;
}

export interface ApiService extends iGet, iDelete, iPost, iPut, iPatch {}
