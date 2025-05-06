'use server';
import { SERVER_URL } from "@/core/constants";
import { API_DATABASE_ENDPOINT } from "@/core/constants/api_endpoint";
import axios from "axios";
import { auth } from "../../../../../auth";
import { GetAllParams } from "../../items/items";

export interface CityResponse {
    success: boolean;
    successCode: string;
    message: string;
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isLastPage: boolean;
    data: City[];
}

export interface City {
    cityId: number;
    cityName: string;
    stateId: number;
    stateName: string;
    status: boolean;
    isDeleted: boolean;
    createAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface DeleteStateResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export interface CityRestoreResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export interface AddCityParams {
    stateId: string;
    cityName: string;
}

export interface CitySingleResponse {
    success: boolean;
    data: City;
}
export interface CityAddResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export async function fetchAllCityByStateId(stateId: string): Promise<CityResponse> {

    console.log()
    try {
        console.log(SERVER_URL+API_DATABASE_ENDPOINT.city.getAllCityByStateId+'?stateId='+stateId)
        let response = await axios.get<CityResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.city.getAllCityByStateId}?stateId=${stateId}`, {
            headers: {
                Authorization: (await auth())?.user.authToken ?? ''
            }
        });

        if (response.data == undefined) {
            throw Error('City Response Failed');
        }
        return response.data;
    }
    catch {
        throw Error('Failure')
    }
}

export async function fetchAllCity(params: GetAllParams): Promise<CityResponse> {
    try {

        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== "")
        );
        const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();

        console.log(SERVER_URL+API_DATABASE_ENDPOINT.city.getAllCity+'?'+queryString)
        let response = await axios.get<CityResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.city.getAllCity}?${queryString}`, {
            headers: {
                Authorization: (await auth())?.user.authToken ?? ''
            }
        });

        if (response.data == undefined) {
            throw Error('City Response Failed');
        }
        return response.data;
    }
    catch {
        throw Error('Failure')
    }
}

export async function deleteCity({ id }: { id: string }): Promise<DeleteStateResponse> {
    try {


        let response = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.city.softDelete}${id}`, {}, {
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

export async function restoreCity(id: string): Promise<CityRestoreResponse> {
    try {
        let response = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.city.restoreCity}${id}`, {}, {
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


export async function getCityById({id}:{id: string}): Promise<CitySingleResponse> {
    try {
        let response = await axios.get<CitySingleResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.city.getSingleCity}${id}`, {
            headers: {
                Authorization: (await auth())?.user.authToken ?? ''
            }
        })

        if (response.data == undefined) {
            throw Error('Response Failed')
        }

        return response.data;
    }
    catch {
        throw Error('Failure')
    }
}

export async function addCity(add: AddCityParams): Promise<CityAddResponse> {
    try {
        const response = await axios.post(
            `${SERVER_URL}${API_DATABASE_ENDPOINT.city.addCity}`,
            add,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: (await auth())?.user.authToken ?? ''
                },
                validateStatus: () => true, // 👈 This makes Axios act like fetch (doesn't throw on 400/409)
            }
        );

        const data = response.data;

        if (data.success) {
            return data;
        } else {
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


export async function updateSCity(reqdata: AddCityParams, id: string): Promise<CityAddResponse> {
    try {
        const res = await axios.put(
            `${SERVER_URL}${API_DATABASE_ENDPOINT.city.updateCity}${id}`,
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
