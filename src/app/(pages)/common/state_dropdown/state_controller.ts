'use server';

import axios from "axios";
import { GetAllParams } from "../../items/items";
import { SERVER_URL } from "@/core/constants";
import { API_DATABASE_ENDPOINT } from "@/core/constants/api_endpoint";
import { auth } from "../../../../../auth";

export interface StateResponse {
    success: boolean;
    successCode: string;
    message: string;
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isLastPage: boolean;
    data: State[];
}

export interface State {
    stateId: number;
    stateName: string;
    status?: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: null;
}

export async function fetchAllState(params: GetAllParams): Promise<StateResponse> {
    try {
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== '')
        );

        const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();
        console.log(SERVER_URL + API_DATABASE_ENDPOINT.state.getAlState + '?' + queryString)
        let response = await axios.get<StateResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.state.getAlState}?${queryString}`, {
            headers: {
                Authorization: (await auth())?.user.authToken ?? ''
            }
        });

        if (response.data == undefined) {
            throw Error("State List Response Failed");
        }

        return response.data!;
    }
    catch {
        throw Error('Failure')
    }
}

export interface DeleteStateResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export async function deleteState({ id }: { id: string }): Promise<DeleteStateResponse> {
    try {

        console.log('URL ==> ', `${SERVER_URL}${API_DATABASE_ENDPOINT.item.softDelete}${id}`)
        let response = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.state.softDelete}${id}`, {}, {
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

export interface AddStateParams {
    stateName: string;
}
export interface StateAddResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export async function addState(add: AddStateParams): Promise<StateAddResponse> {
    // try {
    //     let response = await axios.post<StateAddResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.state.addState}`, add, {
    //         headers: {
    //             Authorization: (await auth())?.user.authToken ?? '',
    //             "Content-Type": "application/json",
    //         }
    //     });
    //     if (response.data == undefined) {
    //         throw Error('State Add Response Failed')
    //     }
    //     console.log('Response ===> ', response.data)
    //     return response.data;
    // }
    // catch {
    //     throw Error('Failure')
    // }

    // try {
    //     const response = await fetch(`${SERVER_URL}${API_DATABASE_ENDPOINT.state.addState}`, {
    //       method: "POST",
    //       body: JSON.stringify(add),
    //       headers: { "Content-Type": "application/json",  Authorization: (await auth())?.user.authToken ?? ''},
    //     });

    //     const data = await response.json();

    //     if (data.success) {
    //       return data;
    //     } else {
    //         console.log("Response ==> ", data)
    //         return data;
    //     }
    //   } catch (error:any) {
    //     console.log("Catch ==> ", error)
    //     throw new Error(error.message);
    //   }

    try {
        const response = await axios.post(
            `${SERVER_URL}${API_DATABASE_ENDPOINT.state.addState}`,
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


export async function updateState(reqdata: AddStateParams, id: string): Promise<StateAddResponse> {
    // try {
    //     let response = await axios.put<StateAddResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.state.updateState}${id}`, data, {
    //         headers: {
    //             Authorization: (await auth())?.user.authToken ?? ''
    //         }
    //     })

    //     if (response.data == undefined) {
    //         throw Error('State Update Response Failed');
    //     }
    //     return response.data;
    // }
    // catch (e) {
    //     throw Error('Failure')
    // }

    try {
        const res = await axios.put(
            `${SERVER_URL}${API_DATABASE_ENDPOINT.state.updateState}${id}`,
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

export interface StateSingleResponse {
    success: boolean;
    data: State;
}

export async function getStateById(id: string): Promise<StateSingleResponse> {
    try {
        let response = await axios.get<StateSingleResponse>(`${SERVER_URL}${API_DATABASE_ENDPOINT.state.getSingleState}${id}`, {
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


export interface StateRestoreResponse {
    success: boolean;
    successCode: string;
    message: string;
}

export async function restoreState(id: string): Promise<StateRestoreResponse> {
    try {
        let response = await axios.put(`${SERVER_URL}${API_DATABASE_ENDPOINT.state.stateRestore}${id}`, {}, {
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