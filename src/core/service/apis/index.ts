import { ApiService } from "./i_api_service";
import { AxiosSingleton } from "./axios";

export const apiServiceInstance: ApiService = AxiosSingleton.getInstance();
