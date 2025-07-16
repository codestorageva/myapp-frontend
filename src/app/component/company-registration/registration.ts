"use server"



import { SERVER_URL } from "@/core/constants";
import { auth } from "../../../../auth";
import { apiServiceInstance } from "@/core/service/apis";
import { API_DATABASE_ENDPOINT, API_ENDPOINTS } from "@/core/constants/api_endpoint";

export interface CompanyRegistrationResponse
{
    success: boolean;
    successCode: string;
    message: string;
}

export interface CompanyRegRequest
{
    companyName: string;
    ownerName: string;
    billingAddress1: string;
    billingAddress2: string;
    billingAddress3: string;

}

export async function companyReg(data : any){
    try
    {
    
        let response = await apiServiceInstance.post<CompanyRegistrationResponse>({
            baseURL: SERVER_URL,
            endpoint: API_ENDPOINTS.companyReg,
            headers: {
                'Content-Type':'application/json',
                Authorization: (await auth())?.user.authToken ?? "",
            },
            data: JSON.stringify(data),
        })
        if(response.data == undefined)
        {
            throw Error('Response failed')
        }
    }
    catch(e)
    {
        throw Error('Registration Failed')
    }
}