'use client'
import TextField from '@/app/component/inputfield'
import CustomLabel from '@/app/component/label'
import Layout from '@/app/component/layout'
import { InvoiceData, InvoiceDetails, InvoiceProduct } from '@/app/types/invoice'
import { faGear, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { use, useEffect, useState } from 'react'
import PreviewInvoice from './view-invoice/page'
import { InvoiceIDModel } from '@/app/component/invoice_prefix_model.tsx'
import { CustomerData, fetchAllCustomer } from '../customer/customer'
import { GetAllItemData, getAllItems, GetAllParams } from '../items/items'
import StateDropDown from '../common/state_dropdown/page'
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from 'formik'
import PreviewInvoicePDF from './view-invoice/page2'
import { generate, GenerateInvoiceRequest, getAllInvoice } from './generate-invoice'
import type { InvoiceItems } from './generate-invoice';
import { toast } from 'react-toastify'
import Loader from '@/app/component/Loader/page'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/app/constants/routes'

const GenerateInvoice = () => {
    const [state, setStateName] = useState('')
    const [city, setCityName] = useState('')
    const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh']
    const cities = ['Ahmedabad', 'Surat', 'Baroda', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Porbandar', 'Morbi', 'Nadiad', 'Bharuch', 'Vapi', 'Ankleshwar', 'Patan', 'Mehsana', 'Bhuj', 'Palanpur', 'Veraval', 'Surendranagar']
    const paymentMode = ['Online', 'Case', 'Banking']
    const terms = ['Net 45', 'Net 60', 'Due On Receipt', 'Due end of the month', 'Due end of the next month', 'Custom']
    const [term, setTerm] = useState('Due On Receipt')
    const [showInvoice, setShowInvoice] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date().toISOString().split('T')[0];
    const [invoiceData, setInvoiceData] = useState<InvoiceDetails>({ term: 'Due On Receipt', customerId: '', customerName: '', dueDate: dueDate, invoicePrefix: 'VV', invoiceNumber: '000001', companyName: '', date: today, time: '', address: '', city: '', gstNo: '', gstPer: '', items: [{ productId: '', finalAmount: 0, amount: 0, qty: 0, rate: 0, gstPer: "0" }], netAmount: '', paymentMode: '', pincode: '', state: '', taxAmount: '', taxValue: '' })
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const param: Partial<GetAllParams> = {
        sortDirection: 'asc',
    }
    const [customerData, setCustomerData] = useState<CustomerData[]>([]);
    const [itemList, setItemListData] = useState<GetAllItemData[]>([]);
    const [rows, setRows] = useState<InvoiceProduct[]>([{ productId: '', qty: 1, rate: 0, amount: 0, gstPer: "0", finalAmount: 0 }]);

    const [isInvoiceGenerate, setGenerateInvoice] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const validateSchema = Yup.object().shape({
        invoicePrefix: Yup.string().required('Prefix is required'),
        invoiceNumber: Yup.string().required('Invoice number is required'),
        date: Yup.string().required('Date is required'),
        dueDate: Yup.string().required('Due date is required'),
        customerId: Yup.string().required('Customer is required'),
        paymentMode: Yup.string().required('Please select Paymeny Mode')
    })

    // const handleItemChange = (index: number, itemId: string) => {
    //     const selectedItem = itemList.find((item) => item.productId === parseInt(itemId));
    //     if (!selectedItem) return;
    //     const newRows = [...rows];
    //     newRows[index].productId = itemId;

    //     const rate = selectedItem.sellingPrice ?? 0;
    //     const qty = newRows[index].qty ?? 1;
    //     newRows[index].qty = qty;
    //     newRows[index].rate = rate;
    //     newRows[index].amount = rate * newRows[index].qty;
    //     console.log("GST PERCENTAGE : ",selectedItem.gstPercent)
    //     setRows(newRows);
    // };

    const handleItemChange = (index: number, itemId: string) => {
        const selectedItem = itemList.find((item) => item.productId === parseInt(itemId));
        if (!selectedItem) return;
        const newRows = [...rows];
        newRows[index].productId = itemId;

        const rate = selectedItem.sellingPrice ?? 0;
        const qty = newRows[index].qty ?? 1;
        const amount = rate * qty;
        const gstPercentStr = selectedItem.gstPercent?.replace('%', '') ?? '0';
        const gstPercent = parseFloat(gstPercentStr);
        const gstAmount = (amount * gstPercent) / 100;
        const finalAmount = amount + gstAmount;
        newRows[index].qty = qty;
        newRows[index].rate = rate;
        newRows[index].gstPer = `${gstPercent}%`;
        newRows[index].amount = amount;
        newRows[index].finalAmount = finalAmount;
        console.log("GST PERCENTAGE : ", selectedItem.gstPercent)
        setRows(newRows);
    };

    const handleQtyChange = (index: number, qty: number) => {
        const newRows = [...rows];
        newRows[index].qty = qty;
        newRows[index].amount = qty * newRows[index].rate;
        setRows(newRows);
    };

    const handleAddRow = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setRows([...rows, { productId: "", qty: 1, rate: 0, amount: 0, gstPer: "0", finalAmount: 0 },]);
    };

    const handleRemoveRow = (index: number) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    // const total = rows.reduce((sum, r) => sum + r.amount, 0);

    // const totalGSTPercent = rows.length
    //     ? rows.reduce((acc, row) => acc + (parseFloat((row.gstPer || '0%').replace('%', '')) || 0), 0) / rows.length
    //     : 0;

    // const cgstPercent = totalGSTPercent / 2;
    // const sgstPercent = totalGSTPercent / 2;

    // const totalCGST = (cgstPercent * total) / 100;
    // const totalSGST = (sgstPercent * total) / 100;
    // const totalFinal = total + totalCGST + totalSGST;

    const gstGroupedTotals = rows.reduce((acc, row) => {
        const gst = parseFloat(row.gstPer.replace('%', '') || '0');
        if (!acc[gst]) {
            acc[gst] = {
                taxableAmount: 0,
                cgstPercent: gst / 2,
                sgstPercent: gst / 2,
                cgstAmount: 0,
                sgstAmount: 0,
            };
        }

        acc[gst].taxableAmount += row.amount;
        return acc;
    }, {} as Record<number, {
        taxableAmount: number,
        cgstPercent: number,
        sgstPercent: number,
        cgstAmount: number,
        sgstAmount: number,
    }>);

    // Calculate CGST and SGST per GST group
    for (const key in gstGroupedTotals) {
        const group = gstGroupedTotals[Number(key)];
        group.cgstAmount = (group.taxableAmount * group.cgstPercent) / 100;
        group.sgstAmount = (group.taxableAmount * group.sgstPercent) / 100;
    }

    const finalTotal = Object.values(gstGroupedTotals).reduce(
        (sum, group) => sum + group.taxableAmount + group.cgstAmount + group.sgstAmount,
        0
    );


    useEffect(() => {
        const invoiceDate = new Date(invoiceData.date);
        let dueDT = new Date(invoiceDate);
        console.log("Term =============> ", invoiceData.term)
        switch (invoiceData.term) {
            case 'Net 45':
                dueDT.setDate(invoiceDate.getDate() + 45);
                break;
            case 'Net 60':
                dueDT.setDate(invoiceDate.getDate() + 60);
                break;
            case 'Due end of the month':
                dueDT = new Date(Date.UTC(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, 0));
                break;
            case 'Due end of the next month':
                dueDT = new Date(Date.UTC(invoiceDate.getFullYear(), invoiceDate.getMonth() + 2, 0));
                break;
            case 'Due On Receipt':
                dueDT = invoiceDate;
                break;
            case 'Custom':
                return;
        }
        console.log('Due Date =====> ', formatDate(dueDT))
        setInvoiceData((prev) => ({ ...prev, dueDate: formatDate(dueDT) }))

    }, [invoiceData.term, invoiceData.date])

    useEffect(() => {
        getAllCustomer();
        getAll();
        getAllInvoices();
    }, [])

    const getAllInvoices = async () => {
        try {
            let res = await getAllInvoice();
            if (res.success) {
                if (res.data.length > 0) {
                    let lastInvoice = res.data[res.data.length - 1];
                    console.log('Last Invoice : ', lastInvoice.invoiceNumber)
                    let lastNum = parseInt(lastInvoice.invoiceNumber, 10); // "00003" → 3
                    let nextNum = lastNum + 1;

                    // Pad it with leading zeros to keep 5 digits (e.g., 00004)
                    let paddedNum = nextNum.toString().padStart(5, '0');
                    setInvoiceData({ ...invoiceData, invoiceNumber: paddedNum })
                }
            }
        }
        catch (e) {
        }
    }

    const getAllCustomer = async () => {
        try {
            let res = await fetchAllCustomer(param as GetAllParams);
            if (res.success) {
                setCustomerData(res.data);
            }
            else {
                setCustomerData([]);
            }
        }
        catch (e) {
            console.log(e);
        }
        finally {

        }
    }

    const getAll = async () => {
        try {
            let res = await getAllItems(param as GetAllParams)
            if (res.success) {
                setItemListData(res.data);
            }
            else {
                setItemListData([]);
            }
        }
        catch (e) {
            console.log(e)
        }
    }


    const handleClose = () => {
        setIsModalOpen(false);
    };

    async function submit(values: typeof invoiceData, { resetForm }: { resetForm: () => void }) {

        const localCompanyId = localStorage.getItem('selectedCompanyId') ?? '';
        const items: InvoiceItems[] = rows
            .filter(row => row.productId && row.qty) // Optional: skip empty entries
            .map(row => ({
                productId: parseInt(row.productId),
                quantity: row.qty,
                rate: row.rate
            }));

        let req: GenerateInvoiceRequest = {
            companyId: parseInt(localCompanyId?.toString()),
            customerId: parseInt(values.customerId),
            dueDate: values.dueDate,
            invoicePrefix: values.invoicePrefix,
            invoiceDate: values.date,
            paymentMode: values.paymentMode,
            terms: values.term,
            items: items,
            invoiceNumber: values.invoiceNumber
        }

        try {
            setIsLoading(true);
            const response = await generate(req);
            if (response.success) {
                router.replace(`${ROUTES.view_invoice}?id=${response.invoiceId}`);
                toast.success(`🎉 ${response.message}`, { autoClose: 2000 });
            }
            else {
                toast.error(`🤔 ${response.message}`, { autoClose: 2000 });
            }
        }
        catch (error: any) {
            toast.error(`🤔 Something went wrong. Please try again!`, { autoClose: 2000 });
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <Layout>
            <div className='w-full flex flex-col  items-center'>
                {isLoading && <Loader />}
                <h1 className="text-3xl font-bold text-center text-black mb-10">New Invoice</h1>
                <Formik
                    validationSchema={validateSchema} // ✅ correct prop
                    initialValues={invoiceData}
                    onSubmit={submit}
                    enableReinitialize
                >
                    {({ values, handleChange, setFieldValue, errors }) => (

                        <Form>
                            <div className='w-[95%] border rounded-md items-start bg-white p-5 mb-5'>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="w-full col-span-1 md:col-span-1">
                                        <CustomLabel title="Invoice #" isCompulsory />
                                        <div className="flex gap-2">
                                            <div className="w-[25%]">
                                                <TextField
                                                    placeholder="Prefix"
                                                    name='invoicePrefix'
                                                    value={values.invoicePrefix}
                                                    onChange={handleChange}
                                                />
                                                <ErrorMessage name="invoicePrefix" component="div" className="text-red-500 text-xs mt-1" />
                                            </div>
                                            <div className="w-[75%] relative">
                                                <TextField
                                                    name='invoiceNumber'
                                                    placeholder="Number"
                                                    value={values.invoiceNumber}
                                                    onChange={handleChange}
                                                    className="pr-10"

                                                />
                                                <ErrorMessage name="invoiceNumber" component="div" className="text-red-600 text-sm mt-1" />
                                                {/* <button
                                                    type="button"
                                                    onClick={() => { }} // your modal function
                                                    className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-blue-600"
                                                    title="Configure Invoice Number"
                                                >
                                                    <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-span-1'>
                                        <TextField label='Invoice Date' name='date' type='date' value={values.date} onChange={handleChange} isCompulsory />
                                        <ErrorMessage name="date" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Term' isCompulsory />
                                        <div className="relative w-full mt-1">
                                            <select
                                                name="term"
                                                value={values.term}
                                                onChange={(e) => {
                                                    const selectedTerm = e.target.value; // Get the selected value from the event
                                                    setFieldValue('term', selectedTerm); // Update term field with selected value

                                                    const invoiceDate = new Date(values.date);
                                                    let dueDT = new Date(invoiceDate); // Create a copy of the invoice date

                                                    // Switch case to determine the due date based on the selected term
                                                    switch (selectedTerm) {
                                                        case 'Net 45':
                                                            dueDT.setDate(invoiceDate.getDate() + 45);
                                                            break;
                                                        case 'Net 60':
                                                            dueDT.setDate(invoiceDate.getDate() + 60);
                                                            break;
                                                        case 'Due end of the month':
                                                            dueDT = new Date(Date.UTC(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, 0));
                                                            break;
                                                        case 'Due end of the next month':
                                                            dueDT = new Date(Date.UTC(invoiceDate.getFullYear(), invoiceDate.getMonth() + 2, 0));
                                                            break;
                                                        case 'Due On Receipt':
                                                            dueDT = new Date(invoiceDate); // Due date is the same as invoice date
                                                            break;
                                                        case 'Custom':
                                                            return; // Custom logic can be handled here
                                                        default:
                                                            return; // Default case to prevent errors
                                                    }

                                                    // Assuming formatDate is a function that formats the date
                                                    setFieldValue('dueDate', formatDate(dueDT));
                                                }} // <- Formik way
                                                className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                            >
                                                {terms.map((term: string, index: number) => (
                                                    <option key={index} value={term}>
                                                        {term}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='col-span-1'>
                                        <TextField label='Due Date' name='dueDate' type='date' value={values.dueDate} onChange={handleChange} isCompulsory />
                                        <ErrorMessage name="dueDate" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>


                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Customer Name' isCompulsory />
                                        <div className="relative w-full mt-1">
                                            {/* <select
                                                value={JSON.stringify({
                                                    customerId: invoiceData.customerId || '',
                                                    companyName: invoiceData.customerName || '',
                                                })}
                                                onChange={(e) => {
                                                    const selected = JSON.parse(e.target.value);
                                                    setInvoiceData({
                                                        ...invoiceData,
                                                        customerId: selected.customerId,
                                                        customerName: selected.companyName,
                                                    });
                                                }}
                                                className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                            >
                                                <option value="">Select Customer</option>
                                                {customerData.map((customer) => (
                                                    <option
                                                        key={customer.customerId}
                                                        value={JSON.stringify({
                                                            customerId: customer.customerId,
                                                            companyName: customer.firstName + ' ' + customer.lastName,
                                                        })}
                                                    >
                                                        {customer.firstName + ' ' + customer.lastName}
                                                    </option>
                                                ))}
                                            </select> */}
                                            <select
                                                name="customerId"
                                                value={values.customerId || ''}
                                                onChange={(e) => {
                                                    const selectedId = e.target.value;
                                                    const selectedCustomer = customerData.find(
                                                        (c) => c.customerId.toString() === selectedId
                                                    );

                                                    setFieldValue('customerId', selectedCustomer?.customerId || '');
                                                    setFieldValue(
                                                        'customerName',
                                                        selectedCustomer
                                                            ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                                                            : ''
                                                    );
                                                }}
                                                className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                            >
                                                <option value="">Select Customer</option>
                                                {customerData.map((customer) => (
                                                    <option key={customer.customerId} value={customer.customerId}>
                                                        {customer.firstName + ' ' + customer.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <ErrorMessage name="customerId" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Payment Mode' />
                                        <div className="relative w-full mt-1">
                                            <select
                                                value={values.paymentMode}
                                                onChange={handleChange}
                                                name='paymentMode'
                                                className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                            >
                                                <option value="">Select Payment Mode</option>
                                                {paymentMode.map((mode: string, index: number) => (
                                                    <option key={index} value={mode}>
                                                        {mode}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                    </div>

                                </div>
                                <div className="space-y-4 mt-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-700 font-inter">Invoice Items</h3>

                                    </div>
                                    <div className="">
                                        <table className="min-w-full text-sm border border-gray-200 rounded overflow-hidden">
                                            <thead className="bg-gray-100">
                                                <tr className="text-sm">
                                                    <td className="px-3 py-2">Item Details</td>
                                                    <td className="px-3 py-2 w-[10%]">Quantity</td>
                                                    <td className="px-3 py-2">Rate</td>
                                                    <td className='px-3 py-2 text-right w-15'>GST</td>
                                                    <td className="px-3 py-2 text-right">Amount</td>
                                                    {/* <td className='px-3 py-2 text-right'>Final Amount</td> */}
                                                    <td className="px-3 py-2 w-10"></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rows.map((row, idx) => (
                                                    <tr key={idx} className="border-t border-gray-200">
                                                        <td className="p-2">
                                                            <select
                                                                value={row.productId}
                                                                onChange={(e) => handleItemChange(idx, e.target.value)}
                                                                className="w-full border border-gray-300 rounded px-2 py-1"
                                                            >
                                                                <option value="">Select an item</option>
                                                                {itemList.map((item: GetAllItemData) => (
                                                                    <option key={item.productId} value={item.productId}>
                                                                        {item.productName}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="p-2 text-right">
                                                            <input
                                                                type="number"
                                                                className="w-full text-right border rounded px-2 py-1"
                                                                value={row.qty}
                                                                onChange={(e) => handleQtyChange(idx, parseFloat(e.target.value))}
                                                                min={1}
                                                            />
                                                        </td>
                                                        <td className="p-2 text-right">
                                                            <input
                                                                type="text"
                                                                className="w-full text-right border rounded px-2 py-1"
                                                                // value={`₹ ${Number(row.rate || 0).toFixed(2)}`}
                                                                value={`₹ ${row.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
                                                                onChange={(e) => {
                                                                    const cleaned = e.target.value.replace(/[^\d.]/g, '');
                                                                    const parsedRate = parseFloat(cleaned);
                                                                    const updatedRows = [...rows];
                                                                    updatedRows[idx].rate = isNaN(parsedRate) ? 0 : parsedRate;
                                                                    updatedRows[idx].amount = updatedRows[idx].rate * updatedRows[idx].qty;
                                                                    setRows(updatedRows);

                                                                }}
                                                            />

                                                        </td>

                                                        <td className='p-2 text-right '>
                                                            {row.gstPer}
                                                        </td>

                                                        <td className="p-2 text-right font-semibold flex-col">
                                                            ₹ {row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}

                                                        </td>
                                                        {/* <td className='p-2 text-right font-semibold'>
                                                            ₹ {row.finalAmount.toLocaleString('en-In', { minimumFractionDigits: 2 })}
                                                        </td> */}
                                                        <td className="text-center">
                                                            <button type='button' onClick={() => handleRemoveRow(idx)} className="text-red-500 text-sm hover:underline">✖</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div className="mt-4 flex items-center gap-2">
                                            <button type='button' onClick={handleAddRow} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                                + Add New Row
                                            </button>
                                        </div>
                                        {/* <div className="mt-6 text-right text-lg font-semibold">
                                            Total (₹): ₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </div> */}
                                        {/* <div className="mt-4 flex justify-end">
                                            <div className="bg-gray-100 p-4 rounded-md border border-gray-300 w-full max-w-sm">
                                                <div className="flex justify-between text-sm text-gray-800">
                                                    <h4 className="text-base font-semibold mb-2 text-gray-700">Taxable Amount</h4>
                                                    <div>
                                                        ₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                                    </div>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-800">
                                                    <div>CGST ({cgstPercent.toFixed(2)}%)</div>
                                                    <div>₹  {totalCGST.toFixed(2)}</div>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-800 mt-1">
                                                    <div>SGST ({sgstPercent.toFixed(2)}%)</div>
                                                    <div>₹ {totalSGST.toFixed(2)}</div>
                                                </div>
                                                <div className="flex justify-between font-bold text-gray-900 mt-2 border-t pt-2">
                                                    <div>Final Total</div>
                                                    <div>₹ {totalFinal.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div> */}

                                        {/* <div className="mt-4 flex justify-end">
                                            <div className="bg-gray-100 p-4 rounded-md border border-gray-300 w-full max-w-md">
                                                {Object.entries(gstGroupedTotals).map(([gstRate, data]) => (
                                                    <div key={gstRate} className="mb-3 text-sm text-gray-800">
                                                 
                                                        <div className="flex justify-between">
                                                            <span>Taxable Amount</span>
                                                            <span>₹ {data.taxableAmount.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>CGST ({data.cgstPercent}%)</span>
                                                            <span>₹ {data.cgstAmount.toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>SGST ({data.sgstPercent}%)</span>
                                                            <span>₹ {data.sgstAmount.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="border-t mt-3 pt-2 font-bold text-gray-900 flex justify-between">
                                                    <div>Grand Total</div>
                                                    <div>₹ {finalTotal.toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="mt-4 flex justify-between items-start">
                                            {/* Table for GST data */}
                                            <div className="bg-gray-100 p-2 rounded-md border border-gray-300 w-full max-w-4xl">
                                                <table className="min-w-full table-auto">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <td className="py-2 text-left text-sm">GST Rate</td>
                                                            <td className="px-4 py-2 text-left text-sm">Taxable Amount (₹)</td>
                                                            <td className="px-4 py-2 text-left text-sm">CGST (%)</td>
                                                            <td className="px-4 py-2 text-left text-sm">CGST Amount (₹)</td>
                                                            <td className="px-4 py-2 text-left text-sm">SGST (%)</td>
                                                            <td className="px-4 py-2 text-left text-sm">SGST Amount (₹)</td>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.entries(gstGroupedTotals).map(([gstRate, data]) => (
                                                            <tr key={gstRate} className="bg-white  hover:bg-gray-50">
                                                                <td className=" px-4 py-2 text-sm">{gstRate}%</td>
                                                                <td className=" px-4 py-2 text-sm">{data.taxableAmount.toFixed(2)}</td>
                                                                <td className=" px-4 py-2 text-sm">{data.cgstPercent}%</td>
                                                                <td className=" px-4 py-2 text-sm">{data.cgstAmount.toFixed(2)}</td>
                                                                <td className=" px-4 py-2 text-sm">{data.sgstPercent}%</td>
                                                                <td className=" px-4 py-2 text-sm">{data.sgstAmount.toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Grand Total */}
                                            <div className="bg-gray-100 p-4 rounded-md border border-gray-300 w-full max-w-md ml-4">
                                                <div className="flex justify-between text-sm text-gray-800">
                                                    <h4 className="text-base font-semibold mb-2 text-gray-700">Total Taxable Amount</h4>
                                                    <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.taxableAmount, 0).toFixed(2)}</div>
                                                </div>

                                                {/* Total CGST Amount */}
                                                <div className="flex justify-between text-sm text-gray-800">
                                                    <div>Total CGST</div>
                                                    <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.cgstAmount, 0).toFixed(2)}</div>
                                                </div>

                                                {/* Total SGST Amount */}
                                                <div className="flex justify-between text-sm text-gray-800 mt-1">
                                                    <div>Total SGST</div>
                                                    <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.sgstAmount, 0).toFixed(2)}</div>
                                                </div>

                                                <div className="flex justify-between text-sm text-gray-800 mt-2">
                                                    <div>Round Off</div>
                                                    <div>{Math.round(finalTotal - 0.5) === finalTotal ? '₹ 0.00' : (finalTotal - Math.round(finalTotal)).toFixed(2)}</div>
                                                </div>

                                                {/* Grand Total */}
                                                <div className="border-t mt-3 pt-2 font-bold text-gray-900 flex justify-between">
                                                    <div>Grand Total</div>
                                                    {/* <div>₹ {finalTotal.toFixed(2)}</div> */}
                                                    <div> ₹ {(finalTotal - (finalTotal - Math.round(finalTotal))).toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}</div>

                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>

                                <div className="mt-10 w-full flex items-center justify-center gap-5">
                                    <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium font-inter shadow-lg">
                                        Generate
                                    </button>
                                    <button type="submit" className="w-full md:w-auto  bg-[#03508C] text-white hover:bg-[#0874CB] px-6 py-2 rounded-lg font-medium font-inter transition-colors shadow-lg" onClick={() => { router.back() }}>
                                        Cancel
                                    </button>
                                </div>

                            </div>
                        </Form>
                    )}
                </Formik>
                {/* <div className='w-[95%] border rounded-md items-start bg-white p-5 mb-5'>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="w-full col-span-1 md:col-span-1">
                            <CustomLabel title="Invoice #" />
                            <div className="flex gap-2">
                                <div className="w-[25%]">
                                    <TextField
                                        placeholder="Prefix"
                                        name='prefix'
                                        value={invoiceData.invoicePrefix}
                                        onChange={(e) =>
                                            setInvoiceData({ ...invoiceData, invoicePrefix: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="w-[75%] relative">
                                    <TextField
                                        name='invoiceNo'
                                        placeholder="Number"
                                        value={invoiceData.invoiceNumber}
                                        onChange={(e) =>
                                            setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })
                                        }
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { }} // your modal function
                                        className="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-blue-600"
                                        title="Configure Invoice Number"
                                    >
                                        <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <TextField label='Invoice Date' name='date' type='date' value={invoiceData.date} onChange={(e) => { setInvoiceData({ ...invoiceData, date: e.target.value }) }} />

                        <div className="sm:col-span-1">
                            <CustomLabel title='Term' />
                            <div className="relative w-full mt-1">
                                <select
                                    value={term}
                                    onChange={(e) => { setTerm(e.target.value) }}

                                    name='term'
                                    className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                >
                                    <option value="">Select Term</option>
                                    {terms.map((term: string, index: number) => (
                                        <option key={index} value={term}>
                                            {term}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <TextField label='Due Date' name='dueDate' type='date' value={invoiceData.dueDate} onChange={(e) => { setInvoiceData({ ...invoiceData, dueDate: e.target.value }) }} />

                        <div className="sm:col-span-1">
                            <CustomLabel title='Customer Name' />
                            <div className="relative w-full mt-1">
                                <select
                                    value={JSON.stringify({
                                        customerId: invoiceData.customerId || '',
                                        companyName: invoiceData.customerName || '',
                                    })}
                                    onChange={(e) => {
                                        const selected = JSON.parse(e.target.value);
                                        setInvoiceData({
                                            ...invoiceData,
                                            customerId: selected.customerId,
                                            customerName: selected.companyName,
                                        });
                                    }}
                                    className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                >
                                    <option value="">Select Customer</option>
                                    {customerData.map((customer) => (
                                        <option
                                            key={customer.customerId}
                                            value={JSON.stringify({
                                                customerId: customer.customerId,
                                                companyName: customer.firstName + ' ' + customer.lastName,
                                            })}
                                        >
                                            {customer.firstName + ' ' + customer.lastName}
                                        </option>
                                    ))}
                                </select>
                            </div>


                        </div>
                        <div className="sm:col-span-1">
                            <CustomLabel title='Payment Mode' />
                            <div className="relative w-full mt-1">
                                <select
                                    value={invoiceData.paymentMode}
                                    onChange={(e) => {
                                        setInvoiceData({ ...invoiceData, paymentMode: e.target.value })
                                    }}
                                    className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                >
                                    <option value="">Select Payment Mode</option>
                                    {paymentMode.map((mode: string, index: number) => (
                                        <option key={index} value={mode}>
                                            {mode}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                    </div>
                    <div className="space-y-4 mt-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-700 font-inter">Invoice Items</h3>

                        </div>
                        <div className="">
                            <table className="min-w-full text-sm border border-gray-200 rounded overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr className="text-sm">
                                        <td className="px-3 py-2">Item Details</td>
                                        <td className="px-3 py-2">Quantity</td>
                                        <td className="px-3 py-2">Rate</td>
                                        <td className="px-3 py-2 text-right">Amount</td>
                                        <td className="px-3 py-2 w-10"></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, idx) => (
                                        <tr key={idx} className="border-t border-gray-200">
                                            <td className="p-2 px-3">
                                                <select
                                                    value={row.productId}
                                                    onChange={(e) => handleItemChange(idx, e.target.value)}
                                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                                >
                                                    <option value="">Select an item</option>
                                                    {itemList.map((item: GetAllItemData) => (
                                                        <option key={item.productId} value={item.productId}>
                                                            {item.productName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-2 text-right">
                                                <input
                                                    type="number"
                                                    className="w-full text-right border rounded px-2 py-1"
                                                    value={row.qty}
                                                    onChange={(e) => handleQtyChange(idx, parseFloat(e.target.value))}
                                                    min={1}
                                                />
                                            </td>
                                            <td className="p-2 text-right">
                                                <input
                                                    type="text"
                                                    className="w-full text-right border rounded px-2 py-1"
                                                    value={`₹ ${Number(row.rate || 0).toFixed(2)}`}
                                                    onChange={(e) => {
                                                        const cleaned = e.target.value.replace(/[^\d.]/g, '');
                                                        const parsedRate = parseFloat(cleaned);
                                                        const updatedRows = [...rows];
                                                        updatedRows[idx].rate = isNaN(parsedRate) ? 0 : parsedRate;
                                                        updatedRows[idx].amount = updatedRows[idx].rate * updatedRows[idx].qty;
                                                        setRows(updatedRows);

                                                    }}
                                                />
                                            </td>
                                            <td className="p-2 text-right font-semibold">
                                                ₹ {row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                            </td>

                                            <td className="text-center">
                                                <button onClick={() => handleRemoveRow(idx)} className="text-red-500 text-sm hover:underline">✖</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="mt-4 flex items-center gap-2">
                                <button
                                    onClick={handleAddRow}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    + Add New Row
                                </button>
                            </div>

                            <div className="mt-6 text-right text-lg font-semibold">
                                Total (₹): ₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </div>
                        </div>

                    </div>

                    <div className="mt-10 w-full flex items-center justify-center gap-5">
                        <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium font-inter shadow-lg">
                            Generate
                        </button>
                        <button type="submit" className="w-full md:w-auto  bg-[#03508C] text-white hover:bg-[#0874CB] px-6 py-2 rounded-lg font-medium font-inter transition-colors shadow-lg">
                            Cancel
                        </button>
                    </div>

                </div> */}
            </div>

            {/* <PreviewInvoice invoiceData={invoiceData} /> */}
            {/* <PreviewInvoicePDF invoiceData={invoiceData} /> */}
        </Layout>
    )
}

export default GenerateInvoice