'use server';
import { SERVER_URL } from "@/core/constants";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { apiServiceInstance } from "@/core/service/apis";
import { auth } from "../../../../auth";
import { CompanyData } from "../main-dashboard/company-list";

export interface CompanyDetailsResponse
{
    success: boolean;
    successCode: string;
    data: CompanyData;
}


export async function getCompanyById(id: string): Promise<CompanyDetailsResponse> {
    console.log("URL ==========>",SERVER_URL+API_ENDPOINTS.companyDetails + id )
    try {
      let response = await apiServiceInstance.get<CompanyDetailsResponse>({
        baseURL: SERVER_URL,
        endpoint: API_ENDPOINTS.companyDetails + id,
        headers: { Authorization: (await auth())?.user.authToken ?? '' },
      });
      
      // console.log("Response : ",response)
      if (response.data == undefined) {
        throw Error("Response Failed");
      }

      return response.data;
    } catch {
      throw Error("Failure");
    }
  }