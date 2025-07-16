export type BillProduct = {
    productId: string;
    account: string;
    qty: number;
    rate: number;
    amount: number;
    gstPer: string;
    finalAmount: number;
    taxPref: string;
    customerId?: string;
    customerName?: string;
}