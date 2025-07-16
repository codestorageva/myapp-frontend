'use server'
import { SERVER_URL } from "@/core/constants"
import { API_DATABASE_ENDPOINT, API_ENDPOINTS } from "@/core/constants/api_endpoint"
import { apiServiceInstance } from "@/core/service/apis"
import { auth } from "../../../../auth"
import axios from "axios"
import { headers } from "next/headers"
import { GetAllParams } from "../items/items"

export interface CompanyListResponse {
  success: boolean
  successCode: string
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  isLastPage: boolean
  data: CompanyData[]
}

export interface CompanyData {
  companyId: number
  companyName: string
  ownerName: string
  logo: string
  billingAddress1: string
  billingAddress2: string
  billingAddress3: string
  billingStateId: string
  billingStateName: string
  billingCityId: string
  billingCityName: string
  billingPincode: string
  shippingAddress1: string
  shippingAddress2: string
  shippingAddress3: string
  shippingStateId: string
  shippingStateName: string
  shippingCityId: string
  shippingCityName: string
  shippingPincode: string
  panNumber: string
  gstNumber: string
  serviceDescription: string
  industry: string
  status: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: any
  bankDetails: BankDetail[]
  invoices: any[]
  password: string
  mobileNumber: string
}

export interface BankDetail {
  bankId: number
  bankName: string
  ifscCode: string
  branch: string
  accountNumber: string
  accHolderName: string
  bankAddress: string
  status: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  deletedAt: any
  companyId: number
}

export interface DeleteCompanyResponse {
  success: boolean;
  successCode: string;
  message: string;
}

export interface CompanyRestoreResponse
{
    success: boolean;
    successCode: string;
    message: string;
}


export async function getAllCompanies(params: GetAllParams): Promise<CompanyListResponse> {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
  );

  const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();

    const token = (await auth())?.user.authToken ?? '';
    let response = await apiServiceInstance.get<CompanyListResponse>({
      baseURL: SERVER_URL,
      endpoint: `${API_ENDPOINTS.companyList}?${queryString}`,
      headers: {
        Authorization: token
      }
    })

    if (response.data == undefined) {
      throw new Error('API Response Failed')
    }

    return response.data;
  }
  catch {
    throw Error('Failed')
  }
}

export async function softDeleteCompany({ id }: { id: string }): Promise<DeleteCompanyResponse> {
  try {
    let response = await axios.put(`${SERVER_URL}${API_ENDPOINTS.companyDelete}${id}`, {}, {
      headers: {
        Authorization: (await auth())?.user.authToken ?? ''
      }
    })
    console.log('Response =====> ', response.data)
    if (response.data === undefined) {
      throw Error('Response Failed')
    }
    return response.data;
  }
  catch {
    throw Error('Failure')
  }
}

export async function restoreCompany({ id }: { id: string }): Promise<CompanyRestoreResponse> {
  try {
    let response = await axios.put(`${SERVER_URL}${API_ENDPOINTS.companyRestore}${id}`, {}, {
      headers: {
        Authorization: (await auth())?.user.authToken ?? ''
      }
    })
    console.log('Response =====> ', response.data)
    if (response.data === undefined) {
      throw Error('Response Failed')
    }
    return response.data;
  }
  catch {
    throw Error('Failure')
  }
}

