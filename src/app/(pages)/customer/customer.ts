'use server';
import { SERVER_URL } from "@/core/constants";
import { auth } from "../../../../auth";
import { apiServiceInstance } from "@/core/service/apis";
import { API_DATABASE_ENDPOINT } from "@/core/constants/api_endpoint";
import axios from "axios";
import { GetAllParams } from "../items/items";

export interface AddCustomerResponse {
  success: boolean;
  successCode: string;
  message: string;
}

export interface AddCustomerRequest {
  customerType: string;
  salutation: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  workPhone: string;
  mobileNumber: string;
  pan: string;
  gstNumber: string;
  billingAttention: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPincode: string;
  billingStateId: number;
  billingCityId: number;
  shippingAttention: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingPincode: string;
  shippingStateId: number;
  shippingCityId: number;
  companyId: number;
  contactPersons: ContactPersons[];
  placeOfSupplyStateId: string;
}

export interface ContactPersons {
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  workPhone: string;
  mobileNumber: string;
}

export interface GetSingleCustomerResponse {
  success: boolean;
  successCode: string;
  data: CustomerData;
}

export interface CustomerData {
  customerId: number;
  customerType: string;
  salutation: string;
  firstName: string;
  lastName: string;
  companyName: string;
  displayName: string;
  email: string;
  workPhone: string;
  mobileNumber: string;
  pan: string;
  gstNumber: string;
  billingAttention: string;
  billingAddressLine1: string;
  billingAddressLine2: string;
  billingPincode: string;
  billingCityId: number;
  billingCityName: string;
  billingStateId: number;
  billingStateName: string;
  shippingAttention: string;
  shippingAddressLine1: string;
  shippingAddressLine2: string;
  shippingPincode: string;
  shippingCityId: number;
  shippingCityName: string;
  shippingStateId: number;
  shippingStateName: string;
  status: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  contactPersons: ContactPersonData[];
  companyId: number;
  placeOfSupplyStateId: string;
  placeOfSupplyStateName: string;
}
export interface ContactPersonData {
  contactPersonId: number;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  workPhone: string;
  mobileNumber: string;
  isStatus: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface GetAllCustomerListResponse {
  success: boolean;
  successCode: string;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPage: number;
  isLastPage: boolean;
  data: CustomerData[];
}

export interface DeleteCustomerResponse {
  success: boolean;
  successCode: string;
  message: string;
}

export interface CustomerRestoreResponse {
  success: boolean;
  successCode: string;
  message: string;
}

export interface CustomerUpdateResponse {
  success: boolean;
  successCode: string;
  message: string;
}


// export async function addNewCustomer(req: AddCustomerRequest): Promise<AddCustomerResponse> {
//     console.log("Request =============> ", req)
//     const token = (await auth())?.user.authToken ?? '';
//     console.log("Token =========> ", token)
//     //try {
//         // let res = await apiServiceInstance.post<AddCustomerResponse>({
//         //     baseURL: SERVER_URL,
//         //     endpoint:API_DATABASE_ENDPOINT.customer.addCustomer,
//         //     data: JSON.stringify(req),
//         //     headers: {
//         //         Authorization: `${token}`,
//         //         "Content-Type": "application/json"
//         //     },

//         // });
//             console.log('API REQUEST ====> ', req)
//             const res = await axios.post(`${SERVER_URL}${API_DATABASE_ENDPOINT.customer.addCustomer}`,
//                 req,
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `${token}`,
//                     },
//                 }
//             );
//             console.log("Response =============> ", res.data)

//         const responseData = res.data!;

//         if (responseData.success) {
//             return responseData;
//         } else {
//             console.log("Response ==> ", responseData);
//             return responseData; 
//         }

//     //}
//     // catch (e: any) {
//     //     console.error('Add New Item Error:', e);
//     //     throw Error(e?.response?.data?.message || e?.message || 'Failed');
//     // }
// }

export async function addNewCustomer(req: AddCustomerRequest): Promise<AddCustomerResponse> {
  console.log("Request =============> ", req);

  const token = (await auth())?.user.authToken ?? '';
  console.log("Token =========> ", token);

  try {
    const res = await axios.post<AddCustomerResponse>(
      `${SERVER_URL}${API_DATABASE_ENDPOINT.customer.addCustomer}`,
      req,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      }
    );

    const responseData = res.data;
    console.log("Axios Response Data =============> ", responseData.successCode);

    return responseData;

  } catch (error: any) {
    console.error('Axios Error =============> ', error);

    const message = error?.response?.data?.message || error.message || 'Unknown error';

    return {
      success: false,
      successCode: '',
      message: message,
    };
  }
}

export async function fetchAllCustomer(params: GetAllParams): Promise<GetAllCustomerListResponse> {
  try {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
    );

    const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();
    console.log("URL => ", SERVER_URL + API_DATABASE_ENDPOINT.customer.getAllCustomer + '?' + queryString)
    let response = await axios.get<GetAllCustomerListResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.customer.getAllCustomer}?${queryString}`, {
      headers: {
        Authorization: (await auth())?.user.authToken ?? ''
      }
    });

    if (response.data == undefined) {
      throw Error("Customer List Response Failed");
    }

    return response.data!;
  }
  catch {
    throw Error('Failure')
  }
}

export async function deleteCus({ id }: { id: string }): Promise<DeleteCustomerResponse> {
  try {
    let response = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.customer.softDelete}${id}`, {}, {
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


export async function restoreCustomer(id: string): Promise<CustomerRestoreResponse> {
  try {
      let response = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.customer.restoreCustomer}${id}`, {}, {
          headers: {
              Authorization: (await auth())?.user.authToken ?? ''
          }
      })
      if (response.data == undefined) {
          throw Error('Restore Item Failed')
      }

      return response.data;
  }
  catch (e) {
      throw Error('Failure')
  }
}

export async function getCustomerById({id}:{id: string}): Promise<GetSingleCustomerResponse> {
  try {
      let response = await axios.get<GetSingleCustomerResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.customer.getSingleCustomer}${id}`, {
          headers: {
              Authorization: (await auth())?.user.authToken ?? ''
          }
      })
      console.log("Customer GET Response ==============> ",response.data)
      if (response.data == undefined) {
          throw Error('Response Failed')
      }

      return response.data;
  }
  catch {
      throw Error('Failure')
  }
}

export async function updateCustomer(reqdata: AddCustomerRequest, id: string): Promise<CustomerUpdateResponse> {
  try {
      const res = await axios.put(
          `${SERVER_URL}${API_DATABASE_ENDPOINT.customer.updateCustomer}${id}`,
          reqdata,
          {
              headers: {
                  "Content-Type": "application/json",
                  Authorization: (await auth())?.user.authToken ?? ''
              },
              validateStatus: () => true, 
          }
      );

      const data = res.data;
      if (data.success) {
          return data;
      } else {
          // Handle other cases where success is false (like validation errors)
          console.log("Response ==> ", data);
          return data; // or throw if needed
      }

  } catch (error: any) {
      console.log("Catch ==> ", error);
      if (axios.isAxiosError(error) && error.response?.data) {
          throw new Error(error.response.data.message || 'API error');
      }

      throw new Error(error.message || 'Unknown error');
  }
}
