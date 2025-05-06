"use server"



import { SERVER_URL } from "@/core/constants";
import { auth } from "../../../../auth";
import { apiServiceInstance } from "@/core/service/apis";
import { API_ENDPOINTS } from "@/core/constants/api_endpoint";
import axios from "axios";

export interface CompanyRegistrationResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export interface CompanyRegRequest {
    companyName: string;
    ownerName: string;
    billingAddress1: string;
    billingAddress2: string;
    billingAddress3: string;
    billingStateId: string;
    billingCityId: string;
    billingPincode: string;
    shippingAddress1: string;
    shippingAddress2: string;
    shippingAddress3: string;
    shippingStateId: string;
    shippingCityId: string;
    shippingPincode: string;
    panNumber: string;
    gstNumber: string;
    serviceDescription: string;
    industry: string;
    bankName: string;
    accHolderName: string;
    ifscCode: string;
    branch: string;
    accountNumber: string;
    bankAddress: string;
}
export interface BankDetails {
    bankName: string;
    accHolderName: string;
    ifscCode: string;
    branch: string;
    accountNumber: string;
    bankAddress: string;
    status: boolean;
}

export async function companyReg(file: File | null, reqData: CompanyRegRequest): Promise<CompanyRegistrationResponse> {
    try {

        const formData = new FormData();
        Object.entries(reqData).forEach(([key, value]) => {
            formData.append(key, value as string)
        })

        if (file !== null) {
            formData.append('logoFile', file)
        }

        const token = (await auth())?.user.authToken ?? '';
        console.log("Form Data =====> ", formData)
        console.log("URL ======> ", `${SERVER_URL}/${API_ENDPOINTS.companyReg}`)
        console.log("Auth Token ====>", token);
        const res = await axios.put(`${SERVER_URL}/${API_ENDPOINTS.companyReg}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`,
                },
            }
        );
        console.log('Response ===> ', res.data)
        if (res.data == undefined) {
            throw Error("Response Failed");
        }
        return res.data;

        // let response = await apiServiceInstance.post<CompanyRegistrationResponse>({
        //     baseURL: SERVER_URL,
        //     endpoint: API_ENDPOINTS.companyReg,
        //     headers: {
        //         'Content-Type':'application/json',
        //         Authorization: (await auth())?.user.authToken ?? "",
        //     },
        //     data: JSON.stringify(data),
        // })
        // if(response.data == undefined)
        // {
        //     throw Error('Response failed')
        // }

    }
    catch (error: any) {
        console.error("Company Registration API Error:", error);

        throw Error(error?.response?.data?.message || 'Registration Failed');
    }
}

export async function companyUpdate(file: File | null, reqData: CompanyRegRequest, id: string): Promise<CompanyRegistrationResponse> {
    try {

        const formData = new FormData();
        Object.entries(reqData).forEach(([key, value]) => {
            formData.append(key, value as string)
        })

        if (file !== null) {
            formData.append('logoFile', file)
        }

        const token = (await auth())?.user.authToken ?? '';
        // console.log(token);
        console.log("Authentication Token ==========> ", token)
        // const res = await axios.put(`${SERVER_URL}/${API_ENDPOINTS.companyUpdate}${id}`,
        //     formData,
        //     {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //             Authorization: `${token}`,
        //         },
        //     }
        // );

        // console.log('Response ===> ', res.data)
        // if (res.data == undefined) {
        //     throw Error("Updated Failed");
        // }
        // return res.data;
        const endpoint = `${SERVER_URL}${API_ENDPOINTS.companyUpdate}${id}`;
        console.log(SERVER_URL+API_ENDPOINTS.companyUpdate+id)
        const response = await fetch(endpoint,
            {
                method: "PUT",
                headers: {
                    Authorization: token, 
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(errorBody.message || "Updated failed");
        }

        const data = await response.json();
        return data;

    }
    catch (error: any) {
        console.error("Company Update API Error:", error);

        throw Error(error?.response?.data?.message || 'Updation Failed');
    }
}