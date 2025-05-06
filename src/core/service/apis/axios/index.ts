import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { ApiService, ReqOptions, Response } from "../i_api_service";


export class AxiosSingleton implements ApiService {
  private static axios: AxiosInstance;
  private static instance: AxiosSingleton;

  private constructor() {
    if (!AxiosSingleton.axios) {
      AxiosSingleton.axios = axios.create({
        headers: {
          token: "", 
        },
      });

      AxiosSingleton.axios.interceptors.response.use(
        (response: AxiosResponse) => response,
        (error: AxiosError) => error.response
      );
    }
  }

  public static getInstance(): AxiosSingleton {
    if (!AxiosSingleton.instance) {
      AxiosSingleton.instance = new AxiosSingleton();
    }
    return AxiosSingleton.instance;
  }

  async get<T>(option: ReqOptions): Promise<Response<T>> {
    try {
      const response: AxiosResponse<T> = await AxiosSingleton.axios.get<T>(
        `${option.baseURL}/${option.endpoint}`,
        {
          params: option.params,
          headers: option.headers || {},
        }
      );
      return response;
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }

  async delete<T>(option: ReqOptions): Promise<Response<T>> {
    try {
      const response: AxiosResponse<T> = await AxiosSingleton.axios.delete<T>(
        `${option.baseURL}/${option.endpoint}`,
        {
          params: option.params,
          headers: option.headers || {},
        }
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }

  async post<T>(option: ReqOptions): Promise<Response<T>> {
    try {
      const response: AxiosResponse<T> = await AxiosSingleton.axios.post<T>(
        `${option.baseURL}/${ option.endpoint}`,
        option.data ?? option.params,
        {
          headers: option.headers || {},
        }
      );

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }

  async put<T>(option: ReqOptions): Promise<Response<T>> {
    try {
      const response: AxiosResponse<T> = await AxiosSingleton.axios.put<T>(
        `${option.baseURL}/${option.endpoint}`,
        option.data,
        {
          headers: option.headers || {},
        }
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }

  async patch<T>(option: ReqOptions): Promise<Response<T>> {
    try {
      const response: AxiosResponse<T> = await AxiosSingleton.axios.patch<T>(
        `${option.baseURL}/${option.endpoint}`,
        option.data,

        {
          headers: option.headers || {},
        }
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw new Error((error as AxiosError).message);
    }
  }
}
