import { JSX } from "react/jsx-runtime";

export interface VendorDataRow{
    no: number;
    name: string;
    companyName: string;
    email: string;
    workPhone: string;
    payables:string;
    unusedCredit:string;
    action:JSX.Element
}