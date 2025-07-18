'use client'
import TextField from '@/app/component/inputfield'
import CustomLabel from '@/app/component/label'
import Layout from '@/app/component/layout'
import { InvoiceData, InvoiceDetails, InvoiceProduct, OtherCharges } from '@/app/types/invoice'
import { faGear, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { use, useEffect, useState } from 'react'
import PreviewInvoice from '../view-invoice/page'
import { InvoiceIDModel } from '@/app/component/invoice_prefix_model.tsx'
import { CustomerData, fetchAllCustomer } from '../../../customer/customer'
import { GetAllItemData, getAllItems, GetAllParams } from '../../../items/items'
import StateDropDown from '../../../common/state_dropdown/page'
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from 'formik'
import PreviewInvoicePDF from '../view-invoice/page2'
import { generate, GenerateInvoiceRequest, getAllInvoice } from './generate-invoice'
import type { InvoiceItems } from './generate-invoice';
import { toast } from 'react-toastify'
import Loader from '@/app/component/Loader/page'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/app/constants/routes'
import Colors from '@/app/utils/colors'
import AddNewItem from '../../../items/new-item/page'

const GenerateInvoice = () => {
    const [state, setStateName] = useState('')
    const [city, setCityName] = useState('')
    const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh']
    const cities = ['Ahmedabad', 'Surat', 'Baroda', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Porbandar', 'Morbi', 'Nadiad', 'Bharuch', 'Vapi', 'Ankleshwar', 'Patan', 'Mehsana', 'Bhuj', 'Palanpur', 'Veraval', 'Surendranagar']
    const paymentMode = ['Cash', 'Banking']
    const terms = ['Net 45', 'Net 60', 'Due On Receipt', 'Due end of the month', 'Due end of the next month', 'Custom']
    const [term, setTerm] = useState('Due On Receipt')
    const [showInvoice, setShowInvoice] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date().toISOString().split('T')[0];
    const [invoiceData, setInvoiceData] = useState<InvoiceDetails>({ narration: '', term: 'Due On Receipt', customerId: '', customerName: '', dueDate: dueDate, invoicePrefix: 'VV', invoiceNumber: '000001', companyName: '', date: today, time: '', address: '', city: '', gstNo: '', gstPer: '', items: [{ productId: '', finalAmount: 0, amount: 0, qty: 0, rate: 0, gstPer: "0", taxPref: '' }], netAmount: '', paymentMode: '', pincode: '', state: '', taxAmount: '', taxValue: '' })
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const param: Partial<GetAllParams> = {
        sortDirection: 'asc',
    }
    const [customerData, setCustomerData] = useState<CustomerData[]>([]);
    const [itemList, setItemListData] = useState<GetAllItemData[]>([]);
    const [rows, setRows] = useState<InvoiceProduct[]>([{ productId: '', qty: 1, rate: 0, amount: 0, gstPer: "0", finalAmount: 0, taxPref: '' }]);
    const [showDiesel, setShowDiesel] = useState(false);
    const [dieselAmount, setDieselAmount] = useState('');
    const [isInvoiceGenerate, setGenerateInvoice] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [otherCharges, setOtherCharges] = useState<OtherCharges[]>([]);
    const [roundOff, setRoundOff] = useState<number>(0);
    const [isOutOfGujarat, setIsOutOfGujarat] = useState(false)
    const [isRCM, setIsRCM] = useState(false)
    const validateSchema = Yup.object().shape({
        invoicePrefix: Yup.string().required('Prefix is required'),
        invoiceNumber: Yup.string().required('Invoice number is required'),
        date: Yup.string().required('Date is required'),
        dueDate: Yup.string().required('Due date is required'),
        customerId: Yup.string().required('Customer is required'),
        paymentMode: Yup.string().required('Paymeny Mode is required')
    })
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);



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
        newRows[index].taxPref = selectedItem.taxPreference;
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
        setRows([...rows, { productId: "", qty: 1, rate: 0, amount: 0, gstPer: "0", finalAmount: 0, taxPref: '' },]);
    };

    const handleRemoveRow = (index: number) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    const handleRemoveOtherRow = (index: number) => {
        const newRows = [...otherCharges];
        newRows.splice(index, 1);
        setOtherCharges(newRows);
    };

    const handleAddOtherRow = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setOtherCharges([...otherCharges, { label: '', value: 0 }])

    }

    const handleOtherChange = (index: number, field: 'label' | 'value', value: string) => {
        const newRows = [...otherCharges];
        if (field === 'value') {
            newRows[index][field] = parseFloat(value) || 0;
        } else {
            newRows[index][field] = value;
        }
        setOtherCharges(newRows);
    };

    // const gstGroupedTotals = rows.reduce((acc, row) => {
    //     let gst = parseFloat(row.gstPer?.replace('%', '') || '0');
    //     if (isNaN(gst)) gst = 0;

    //     if (!acc[gst]) {
    //         acc[gst] = {
    //             taxableAmount: 0,
    //             cgstPercent: gst / 2,
    //             sgstPercent: gst / 2,
    //             cgstAmount: 0,
    //             sgstAmount: 0,
    //         };
    //     }

    //     acc[gst].taxableAmount += row.amount || 0; // also prevent NaN from amount
    //     return acc;
    // }, {} as Record<number, {
    //     taxableAmount: number,
    //     cgstPercent: number,
    //     sgstPercent: number,
    //     cgstAmount: number,
    //     sgstAmount: number,
    // }>);

    const gstGroupedTotals = rows.reduce((acc, row) => {
        let gst = parseFloat(row.gstPer?.replace('%', '') || '0');
        if (isNaN(gst)) gst = 0;

        if (!acc[gst]) {
            acc[gst] = {
                taxableAmount: 0,
                cgstPercent: isOutOfGujarat ? 0 : gst / 2,
                sgstPercent: isOutOfGujarat ? 0 : gst / 2,
                igstPercent: isOutOfGujarat ? gst : 0,
                cgstAmount: 0,
                sgstAmount: 0,
                igstAmount: 0,
            };
        }

        const taxable = row.amount || 0;
        acc[gst].taxableAmount += taxable;

        if (isOutOfGujarat) {
            acc[gst].igstAmount += (taxable * gst) / 100;
        } else {
            acc[gst].cgstAmount += (taxable * (gst / 2)) / 100;
            acc[gst].sgstAmount += (taxable * (gst / 2)) / 100;
        }

        return acc;
    }, {} as Record<number, {
        taxableAmount: number;
        cgstPercent: number;
        sgstPercent: number;
        igstPercent: number;
        cgstAmount: number;
        sgstAmount: number;
        igstAmount: number;
    }>);

    // Calculate CGST and SGST per GST group
    for (const key in gstGroupedTotals) {
        const group = gstGroupedTotals[Number(key)];
        group.cgstAmount = (group.taxableAmount * group.cgstPercent) / 100;
        group.sgstAmount = (group.taxableAmount * group.sgstPercent) / 100;
        group.igstAmount = (group.taxableAmount * group.igstPercent) / 100;
    }

    const finalTotal = Object.values(gstGroupedTotals).reduce(
        (sum, group) => sum + group.taxableAmount + group.cgstAmount + group.sgstAmount + group.igstAmount,
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

    // useEffect(() => {
    //     const autoRound = Math.round(finalTotal) - finalTotal;
    //     setRoundOff(parseFloat(autoRound.toFixed(2)));
    // }, [finalTotal]);

    useEffect(() => {
        const baseAmount = isRCM
            ? Object.values(gstGroupedTotals).reduce(
                (sum, group) => sum + group.taxableAmount,
                0
            )
            : finalTotal;

        const autoRound = Math.round(baseAmount) - baseAmount;
        setRoundOff(parseFloat(autoRound.toFixed(2)));
    }, [isRCM, finalTotal, gstGroupedTotals]);

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

    async function submit(values: typeof invoiceData, { resetForm }: { resetForm: () => void }) {

        const localCompanyId = localStorage.getItem('selectedCompanyId') ?? '';
        const items: InvoiceItems[] = rows
            .filter(row => row.productId && row.qty) // Optional: skip empty entries
            .map(row => ({
                productId: parseInt(row.productId),
                quantity: row.qty,
                rate: row.rate
            }));
        // const others: OtherCharges[] =  otherCharges.filter(row => row.label && row.rate).map(row=> ({otherCharges: row.label, otherChargesValue: row.rate}));

        let req: GenerateInvoiceRequest = {
            companyId: parseInt(localCompanyId?.toString()),
            customerId: parseInt(values.customerId),
            dueDate: values.dueDate,
            invoicePrefix: values.invoicePrefix,
            invoiceDate: values.date,
            paymentMode: values.paymentMode,
            terms: values.term,
            items: items,
            invoiceNumber: values.invoiceNumber,
            roundOff: roundOff.toFixed(),
            otherCharge: otherCharges,
            narration: values.narration,
            isRcm: isRCM
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

    const otherChargesTotal = otherCharges.reduce((sum, item) => sum + item.value, 0);
    const hasRcmUnit = rows.some(row => row.taxPref.toLowerCase() === 'rcm');

    const handleSelectChange = (idx: number, value: string) => {
        if (value === 'add_new') {
            setIsAddItemModalOpen(true);
        } else {
            handleItemChange(idx, value); // your existing logic
        }
    };

    return (
        <>
            <div className='w-full flex flex-col items-center p-5 '>
                {isLoading && <Loader />}
                <h1 className="text-3xl font-bold text-center text-black mb-10">New Invoice</h1>
                <div className='w-[100%] border rounded-md bg-white p-5 text-black'>
                    <Formik
                        validationSchema={validateSchema}
                        initialValues={invoiceData}
                        onSubmit={submit}
                        enableReinitialize
                    >
                        {({ values, handleChange, setFieldValue, errors }) => (
                            <Form>
                                <div>
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
                                                                return;
                                                            default:
                                                                return;
                                                        }

                                                        // Assuming formatDate is a function that formats the date
                                                        setFieldValue('dueDate', formatDate(dueDT));
                                                    }} // <- Formik way
                                                    className="block w-full rounded-md border bg-white focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
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
                                                        const shippingState = selectedCustomer?.placeOfSupplyStateName;
                                                        if (shippingState != 'Gujarat') {
                                                            setIsOutOfGujarat(true)
                                                        }
                                                        setFieldValue('customerId', selectedCustomer?.customerId || '');
                                                        setFieldValue(
                                                            'customerName',
                                                            selectedCustomer
                                                                ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                                                                : ''
                                                        );
                                                    }}
                                                    className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-300 bg-white placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
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
                                            <CustomLabel title='Payment Mode' isCompulsory />
                                            <div className="relative w-full mt-1">
                                                <select
                                                    value={values.paymentMode}
                                                    onChange={handleChange}
                                                    name='paymentMode'
                                                    className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-300 bg-white placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                                >
                                                    <option value="">Select Payment Mode</option>
                                                    {paymentMode.map((mode: string, index: number) => (
                                                        <option key={index} value={mode}>
                                                            {mode}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <ErrorMessage name="paymentMode" component="div" className="text-red-600 text-sm mt-1" />
                                        </div>
                                    </div>
                                    <div className="space-y-4 mt-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-700 font-inter">Invoice Items</h3>

                                        </div>
                                        <div className="">
                                            <table className="min-w-full text-sm border border-gray-200 rounded overflow-hidden text-black">
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
                                                            <td className="p-1">
                                                                <select
                                                                    value={row.productId}
                                                                    onChange={(e) => { handleSelectChange(idx, e.target.value) }}
                                                                    className="w-full border bg-white py-1 focus:border-red-500 focus:ring-1 focus:ring-red-300 border-gray-300 rounded px-2 text-sm appearance-none"
                                                                >
                                                                    <option value="">Select an item</option>
                                                                    {itemList.map((item: GetAllItemData) => (
                                                                        <option key={item.productId} value={item.productId}>
                                                                            {item.productName}
                                                                        </option>
                                                                    ))}
                                                                    <option value="add_new" className='bg-[#af0000] text-white'> Add New Item</option>
                                                                </select>
                                                            </td>
                                                            <td className="p-2 text-right">
                                                                <input
                                                                    type="number"
                                                                    className="w-full focus:border-red-500 focus:ring-1 focus:ring-red-300 bg-white text-right border rounded px-2 py-1"
                                                                    value={row.qty}
                                                                    //onChange={(e) => handleQtyChange(idx, parseFloat(e.target.value))}
                                                                    onChange={(e) => {
                                                                        if (e.target.value.includes('.')) return;
                                                                        const value = e.target.value;
                                                                        handleQtyChange(idx, value === '' ? 1 : parseFloat(value))
                                                                    }}
                                                                    min={1}
                                                                    step={1}
                                                                    onKeyDown={(e) => {
                                                                        // Prevent typing "." or "," key
                                                                        if (e.key === '.' || e.key === ',') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                />
                                                            </td>
                                                            <td className="p-2 text-right">
                                                                {/* <input
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
                                                            /> */}

                                                                <input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    className="w-full border rounded   focus:border-red-500 focus:ring-1 focus:ring-red-300 bg-white px-2 py-1 text-right"
                                                                    value={row.rate === 0 ? 0 : row.rate}
                                                                    // value={row.rate}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;

                                                                        const updatedRows = [...rows];

                                                                        if (value === '') {
                                                                            updatedRows[idx].rate = 0;
                                                                            updatedRows[idx].amount = 0;
                                                                        } else {
                                                                            const parsed = parseFloat(value);
                                                                            updatedRows[idx].rate = isNaN(parsed) ? 0 : parsed;
                                                                            updatedRows[idx].amount =
                                                                                updatedRows[idx].rate * (updatedRows[idx].qty || 0);
                                                                        }

                                                                        setRows(updatedRows);
                                                                    }}
                                                                />
                                                            </td>

                                                            <td className='p-2 text-right '>
                                                                {row.gstPer === 'NaN%' ? '0%' : row.gstPer}
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
                                                <button type='button' onClick={handleAddRow} className={`bg-[#af0000] text-white px-4 py-2 rounded hover:bg-red-600 text-sm`}>
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
                                            {/* <div className="mt-4 flex justify-between items-start">
                                       
                                            <div className="bg-gray-100 p-2 rounded-md border border-gray-300 w-full max-w-4xl">
                                                <table className="min-w-full table-auto text-black">
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

                                            <div className="bg-gray-100 p-4 rounded-md border border-gray-300 w-full max-w-md ml-4">
                                                <div className="flex justify-between text-sm text-gray-800">
                                                    <h4 className="text-base font-semibold mb-2 text-gray-700">Total Taxable Amount</h4>
                                                    <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.taxableAmount, 0).toFixed(2)}</div>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-800">
                                                    <div>Total CGST</div>
                                                    <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.cgstAmount, 0).toFixed(2)}</div>
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-800 mt-1">
                                                    <div>Total SGST</div>
                                                    <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.sgstAmount, 0).toFixed(2)}</div>
                                                </div>

                                                <div className="flex justify-between text-sm text-gray-800 mt-2">
                                                    <div>Round Off</div>
                                                    <div>{Math.round(finalTotal - 0.5) === finalTotal ? '₹ 0.00' : (finalTotal - Math.round(finalTotal)).toFixed(2)}</div>
                                                </div>
                                                <div className="border-t mt-3 pt-2 font-bold text-gray-900 flex justify-between">
                                                    <div>Grand Total</div>
                                                    <div> ₹ {(finalTotal - (finalTotal - Math.round(finalTotal))).toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}</div>

                                                </div>
                                            </div>
                                        </div> */}
                                            <div className="w-full mt-4 flex items-center gap-2 justify-end">
                                                <input type='checkbox' className='w-5 h-5' checked={isRCM} onChange={(e) => { setIsRCM(e.target.checked) }} /> <span className='text-base'>This transaction is applicable for reverse charge</span>
                                            </div>
                                            <div className="mt-4 flex flex-col lg:flex-row justify-between items-start gap-4">
                                                {/* Left Column: Table + Narration */}
                                                <div className="flex flex-col w-full max-w-5xl gap-4">
                                                    <div className="bg-gray-100 p-2 rounded-md border border-gray-300">
                                                        <table className="min-w-full table-auto text-black">
                                                            <thead>
                                                                <tr className="bg-gray-100">
                                                                    <td className="py-2 text-left text-sm">GST Rate</td>
                                                                    <td className="px-4 py-2 text-left text-sm">Taxable Amount (₹)</td>

                                                                    <td className="px-4 py-2 text-left text-sm">IGST (%)</td>
                                                                    <td className="px-4 py-2 text-left text-sm">IGST Amount (₹)</td>

                                                                    <td className="px-4 py-2 text-left text-sm">CGST (%)</td>
                                                                    <td className="px-4 py-2 text-left text-sm">CGST Amount (₹)</td>
                                                                    <td className="px-4 py-2 text-left text-sm">SGST (%)</td>
                                                                    <td className="px-4 py-2 text-left text-sm">SGST Amount (₹)</td>

                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {Object.entries(gstGroupedTotals).map(([gstRate, data]) => (
                                                                    <tr key={gstRate} className="bg-white hover:bg-gray-50">
                                                                        <td className="px-4 py-2 text-sm">{gstRate}%</td>
                                                                        <td className="px-4 py-2 text-sm">{data.taxableAmount.toFixed(2)}</td>

                                                                        <td className="px-4 py-2 text-sm">{data.igstPercent}%</td>
                                                                        <td className="px-4 py-2 text-sm">{data.igstAmount.toFixed(2)}</td>

                                                                        <td className="px-4 py-2 text-sm">{data.cgstPercent}%</td>
                                                                        <td className="px-4 py-2 text-sm">{data.cgstAmount.toFixed(2)}</td>
                                                                        <td className="px-4 py-2 text-sm">{data.sgstPercent}%</td>
                                                                        <td className="px-4 py-2 text-sm">{data.sgstAmount.toFixed(2)}</td>

                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>

                                                    {/* Narration Box */}
                                                    <div className="w-full">
                                                        <label htmlFor="narration" className="block text-sm font-medium text-gray-700 mb-1">Narration / Remarks:</label>
                                                        <textarea
                                                            id="narration"
                                                            rows={5}
                                                            value={values.narration}
                                                            onChange={handleChange}
                                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-blue-500 text-sm"
                                                            placeholder="Enter remarks or narration here..."
                                                        ></textarea>
                                                    </div>
                                                </div>

                                                {/* Right Column: Grand Total */}
                                                <div className="bg-gray-100 p-4 rounded-md border border-gray-300 w-full max-w-md">
                                                    <div className="flex justify-between text-sm text-gray-800">
                                                        <h4 className="text-base font-semibold mb-2 text-gray-700">Total Taxable Amount</h4>
                                                        <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.taxableAmount, 0).toFixed(2)}</div>
                                                    </div>

                                                    <div className='flex justify-between text-sm text-gray-800'>
                                                        <div>Total IGST</div>
                                                        <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.igstAmount, 0).toFixed(2)}</div>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-800 mt-1">
                                                        <div>Total CGST</div>
                                                        <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.cgstAmount, 0).toFixed(2)}</div>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-800 mt-1">
                                                        <div>Total SGST</div>
                                                        <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.sgstAmount, 0).toFixed(2)}</div>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-800 mt-2">
                                                        <div>Round Off</div>
                                                        {/* <div>{Math.round(finalTotal - 0.5) === finalTotal ? '₹ 0.00' : (finalTotal - Math.round(finalTotal)).toFixed(2)}</div> */}
                                                        <div>
                                                            <input
                                                                type="number"
                                                                className="border px-2 py-1 w-24 rounded text-right"
                                                                value={roundOff.toFixed(2)}
                                                                onChange={(e) => {
                                                                    const value = parseFloat(e.target.value);
                                                                    setRoundOff(isNaN(value) ? 0 : value);
                                                                }}
                                                            />
                                                        </div>
                                                    </div>



                                                    {otherCharges.map((item, index) => (
                                                        <div key={index} className="flex justify-between text-sm text-gray-800 mt-2">
                                                            <input
                                                                type="text"
                                                                value={item.label}
                                                                onChange={(e) => handleOtherChange(index, 'label', e.target.value)}
                                                                className="border px-2 py-1 w-32 rounded"
                                                                placeholder="Label"
                                                            />
                                                            <div>
                                                                <input
                                                                    type="number"
                                                                    value={item.value}
                                                                    onChange={(e) => handleOtherChange(index, 'value', e.target.value)}
                                                                    className="border px-2 py-1 w-24 rounded text-right"
                                                                    placeholder="0.00"
                                                                />
                                                                <span> <button type='button' onClick={() => handleRemoveOtherRow(index)} className="text-red-500 text-xs hover:underline ml-1.5">✖</button></span>
                                                            </div>

                                                        </div>
                                                    ))}

                                                    <button
                                                        onClick={handleAddOtherRow}
                                                        className="text-sm px-3 py-1 bg-[#af0000] text-white rounded hover:bg-red-600 mt-3"
                                                    >
                                                        Add Others
                                                    </button>

                                                    <div className="border-t mt-3 pt-2 font-bold text-gray-900 flex justify-between">
                                                        <div>Grand Total</div>
                                                        {/* <div> ₹ {(
                                                        (finalTotal - otherChargesTotal - (finalTotal - Math.round(finalTotal)))
                                                    ).toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}</div> */}
                                                        {/* <div> ₹ {(
                                                        (finalTotal + roundOff - otherChargesTotal)
                                                    ).toLocaleString('en-IN', {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}</div> */}
                                                        <div>
                                                            ₹ {
                                                                isRCM
                                                                    ? (Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.taxableAmount, 0) + roundOff).toLocaleString('en-IN', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    })
                                                                    : (finalTotal + roundOff - otherChargesTotal).toLocaleString('en-IN', {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2,
                                                                    })
                                                            }
                                                        </div>
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
                </div>
            </div>
            {isAddItemModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className='bg-white rounded'>
                        <AddNewItem isModalOpen={isAddItemModalOpen} onClick={() => { getAll(); setIsAddItemModalOpen(false) }} />
                    </div>

                </div>
            )}
            {/* <PreviewInvoice invoiceData={invoiceData} /> */}
            {/* <PreviewInvoicePDF invoiceData={invoiceData} /> */}
        </>
    )
}

export default GenerateInvoice