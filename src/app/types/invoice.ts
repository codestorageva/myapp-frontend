export type InvoiceItem = 
{
    description: string;
    quantity: number;
    price: number;
};
export type InvoiceData = {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    clientName: string;
    clientAddress: string;
    companyName: string;
    companyAddress: string;
    items: InvoiceItem[];
    taxRate: number;
    discount: number;
};

export type InvoiceDetails = {
    dueDate: string;
    invoicePrefix: string;
    invoiceNumber: string;
    companyName: string;
    date: string;
    time: string;
    customerId: string;
    customerName: string;
    address: string;
    state: string;
    city: string;
    pincode: string;
    gstNo: string;
    paymentMode: string;
    items: InvoiceProduct[];
    taxValue: string;
    gstPer: string;
    taxAmount: string;
    netAmount: string;
    term: string;
    narration: string;
}

export type InvoiceProduct = {
    productId: string;
    qty: number;
    rate: number;
    amount: number;
    gstPer: string;
    finalAmount: number;
    taxPref: string;
}


export type OtherCharges = {
    label: string;
    value: number;
}