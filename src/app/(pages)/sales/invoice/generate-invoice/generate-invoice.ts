'use server';

import { SERVER_URL } from "@/core/constants";
import { API_DATABASE_ENDPOINT } from "@/core/constants/api_endpoint";
import axios from "axios";
import { auth } from "../../../../../../auth";
import { CustomerData } from "../../../customer/customer";
import { OtherCharges } from "@/app/types/invoice";

export interface GenerateInvoiceResponse {
    success: boolean;
    successCode: string;
    message: string;
    invoiceId: number;
}

export interface GenerateInvoiceRequest {
    companyId: number;
    customerId: number;
    invoiceDate: string;
    terms: string;
    dueDate: string;
    paymentMode: string;
    items: InvoiceItems[];
    invoicePrefix: string;
    invoiceNumber: string;
    roundOff: string;
    otherCharge: OtherCharges[];
    narration: string;
    isRcm: boolean;
}

export interface InvoiceItems {
    productId: number;
    quantity: number;
}

export interface GetAllInvoiceResponse
{
    success: boolean;
    successCode: string;
    data: InvoiceData[];
}

export interface InvoiceDetailsResponse {
    success: boolean;
    successCode: string;
    data: InvoiceData;
}

export interface InvoiceData {
    invoiceId: number;
    invoicePrefix: string;
    invoiceNumber: string;
    invoiceDate: string;
    terms: string;
    dueDate: string;
    paymentMode: string;
    narration: string;
    items: ItemDetails[];
    otherCharge: OtherChargeDetails[];
    totalTaxableAmount: number;
    totalIgst: number;
    totalCgst: number;
    totalSgst: number;
    roundOff: number;
    grandTotal: number;
    status: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: any;
    companyId: number;
    customerId: number;
    customer: CustomerData;
}

export interface ItemDetails {
    productId: number;
    quantity: number;
    rate: number;
    taxableAmount: number;
    cgstPercent: number;
    sgstPercent: number;
    cgstAmount: number;
    sgstAmount: number;
    product: Product;
}

export interface OtherChargeDetails {
    otherChargeId: number;
    label: string;
    value: string;
    invoiceId: string;
}

export interface Product{
    productId: number;
    productName: string;
    type: string;
    hsnCode: string;
    sacCode: string;
    unit: string;
    taxPreference: string;
    sellingPrice: string;
    quantity: any;
    rate: any;
    taxValue: any;
    gstPercent: string;
    cgstAmount: string;
    sgstAmount: string;
    netAmount: string;
    description: string;
    status: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    companyId: number;
}

export async function generate(req: GenerateInvoiceRequest): Promise<GenerateInvoiceResponse> {
    try {
        const res = await axios.post(`${SERVER_URL}${API_DATABASE_ENDPOINT.invoice.generate}`, req, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: (await auth())?.user.authToken ?? '',
            }
        })

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

export async function getAllInvoiceById({id} : {id: string}): Promise<InvoiceDetailsResponse>{
    try
    {
        const res = await axios.get(`${SERVER_URL}${API_DATABASE_ENDPOINT.invoice.getById}${id}`,{
            headers:{
                Authorization: (await auth())?.user.authToken??''
            }
        });

        if(res.data == undefined)
        {
            throw Error('Get Invoice Details Failed');
        }
        return res.data;
    }
    catch(e: any)
    {
        throw Error(e?.response?.data?.message || e?.message || 'Failed');
    }
}


export async function getAllInvoice(): Promise<GetAllInvoiceResponse>{
    try
    {
        const res = await axios.get(`${SERVER_URL}${API_DATABASE_ENDPOINT.invoice.getAll}`,{
            headers:{
                Authorization: (await auth())?.user.authToken??''
            }
        });

        if(res.data == undefined)
        {
            throw Error('Get Invoice Details Failed');
        }
        return res.data;
    }
    catch(e: any)
    {
        throw Error(e?.response?.data?.message || e?.message || 'Failed');
    }
}