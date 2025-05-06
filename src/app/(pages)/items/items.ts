"use server";
import { SERVER_URL } from "@/core/constants";
import { API_DATABASE_ENDPOINT, API_ENDPOINTS } from "@/core/constants/api_endpoint";
import { apiServiceInstance } from "@/core/service/apis";
import { auth } from "../../../../auth";
import axios from "axios";
import { headers } from "next/headers";
export interface GetAllParams {
    keyword: string;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: string;
    isDeleted: boolean;
    status: boolean;
}

export interface AddNewItemResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export interface AddNewItemReq {
    productName: string;
    type: string;
    sacCode: string;
    hsnCode: string;
    unit: string;
    taxPreference: string;
    gstPercent: string;
    companyId: number;
    sellingPrice: number;
}

export async function addNewItem(req: AddNewItemReq): Promise<AddNewItemResponse> {
    console.log("Request =============> ", req)
    console.log('URL ====== > ', SERVER_URL + API_DATABASE_ENDPOINT.item.addItem)
    const token = (await auth())?.user.authToken ?? '';
    console.log("Token =========> ", token)
    try {
        // let res = await apiServiceInstance.post<AddNewItemResponse>({
        //     baseURL: 'http://192.168.1.104:8083',
        //     endpoint: '/product',
        //     data: JSON.stringify(req),
        //     headers: {
        //         Authorization: `${token}`,
        //         "Content-Type": "application/json"
        //     },

        // });



        const res = await axios.post(`${SERVER_URL}${API_DATABASE_ENDPOINT.item.addItem}`,
            req,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            }
        );
        console.log("Response =============> ", res.data)
        if (res.data == undefined) {
            throw Error('Add New Item Failed')
        }

        return res.data;
    }
    catch (e: any) {
        console.error('Add New Item Error:', e);
        throw Error(e?.response?.data?.message || e?.message || 'Failed');
    }


    // try {
    //     const response = await fetch("http://192.168.1.104:8083/product", {
    //       method: "POST",
    //       body: JSON.stringify(req),
    //       headers: { "Content-Type": "application/json", Authorization: token},
    //     });

    //     const data = await response.json();
    //     if (data.success) {
    //       return data;
    //     } else {
    //       throw new Error(data.message);
    //     }
    //   } catch (error:any) {
    //     throw new Error(error.message);
    //   }
}


/* Get All Items */
export interface GetAllItemResponse {
    success: boolean;
    successCode: string;
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isLastPage: boolean;
    data: GetAllItemData[];
}
export interface GetAllItemData {
    productId: number;
    productName: string;
    type: string;
    hsnCode?: string;
    sacCode?: string;
    unit: string;
    taxPreference: string;
    quantity: number;
    rate?: number;
    taxValue?: number;
    gstPercent?: string;
    cgstAmount?: number;
    sgstAmount?: number;
    netAmount?: number;
    description?: string;
    status: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: any;
    invoiceId: number;
    sellingPrice: number;
}

export async function getAllItems(params: GetAllParams): Promise<GetAllItemResponse> {
    try {
        const token = (await auth())?.user.authToken ?? '';
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
        );

        const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();
        console.log("URL =======> ", `${API_DATABASE_ENDPOINT.item.allItems}?${queryString}`)
        console.log("Token =>", token)
        const response = await axios.get(`${SERVER_URL}${API_DATABASE_ENDPOINT.item.allItems}?${queryString}`, {
            headers: {
                Authorization: token
            }
        });
        console.log("RESPONSE =======> ", `${response.data}`)
        if (response.data == undefined) {
            throw new Error('API Response Failed')
        }

        return response.data!;
    }
    catch {
        throw Error('Failed')
    }
}


export async function getAllResotreItems(params: GetAllParams): Promise<GetAllItemResponse> {
    try {
        const token = (await auth())?.user.authToken ?? '';
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
        );

        const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();
        console.log("Token =>", token)
        const response = await axios.get(`${SERVER_URL}${API_DATABASE_ENDPOINT.item.allRestoreItems}?${queryString}`, {
            headers: {
                Authorization: token
            }
        });
        console.log("RESPONSE =======> ", `${response.data}`)
        if (response.data == undefined) {
            throw new Error('API Response Failed')
        }

        return response.data!;
    }
    catch {
        throw Error('Failed')
    }
}

export interface DeleteItemResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export async function softDeleteItem({ id }: { id: string }): Promise<DeleteItemResponse> {
    try {
       
        console.log('URL ==> ',`${SERVER_URL}${API_DATABASE_ENDPOINT.item.softDelete}${id}` )
        let response = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.item.softDelete}${id}`, {}, {
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

export interface GetSingleItemResponse
{
    success: boolean;
    successCode: string;
    data: GetAllItemData;
}

export async function fetchSingleItem({id}: {id: string}): Promise<GetSingleItemResponse>{
    try{
        let response = await axios.get(`${SERVER_URL}${API_DATABASE_ENDPOINT.item.getSingleItem}${id}`,{
            headers: {Authorization: (await auth())?.user.authToken ?? ''}
        })

        if(response.data === undefined)
        {
            throw Error('Response Failed');
        }
        return response.data;
    }
    catch{
        throw Error('Failure')
    }
}

export interface UpdateItemResponse
{
    success: boolean;
    successCode: string;
    message: string;
}

export async function updateNewItem(id: string, req: AddNewItemReq): Promise<UpdateItemResponse> {
    console.log("Request =============> ", req)
    console.log('URL ====== > ', SERVER_URL + API_DATABASE_ENDPOINT.item.addItem)
    const token = (await auth())?.user.authToken ?? '';
    console.log("Token =========> ", token)
    try {
    const res = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.item.updateItem}${id}`,
            req,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            }
        );
        console.log("Response =============> ", res.data)
        if (res.data == undefined) {
            throw Error('Add New Item Failed')
        }

        return res.data;
    }
    catch (e: any) {
        console.error('Add New Item Error:', e);
        throw Error(e?.response?.data?.message || e?.message || 'Failed');
    }
}

export interface ItemRestoreResponse
{
    success: boolean;
    successCode: string;
    message: string;
}

export async function restoreItem(id: string): Promise<ItemRestoreResponse>{
    try
    {
        let response = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.item.itemRestore}${id}`,{}, {
            headers: {
                Authorization: (await auth())?.user.authToken??''
            }
        })
        if(response.data == undefined)
        {
            throw Error('Restore Item Failed')
        }
        
        return response.data;
    }
    catch(e)
    {
        throw Error('Failure')
    }
}