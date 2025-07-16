'use client'
import TextField from '@/app/component/inputfield'
import CustomLabel from '@/app/component/label'
import Layout from '@/app/component/layout'
import { InvoiceData, InvoiceDetails, InvoiceProduct } from '@/app/types/invoice'
import { faGear, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import PreviewInvoice from '../view-invoice/page2'
import { InvoiceIDModel } from '@/app/component/invoice_prefix_model.tsx'
import { CustomerData, fetchAllCustomer } from '../../customer/customer'
import { GetAllItemData, getAllItems, GetAllParams } from '../../items/items'
import StateDropDown from '../../common/state_dropdown/page'
import * as Yup from "yup";

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
    const [invoiceData, setInvoiceData] = useState<InvoiceDetails>({term:'Due On Receipt', customerId: '', customerName: '', dueDate: dueDate, invoicePrefix: 'VV', invoiceNumber: '000001', companyName: '', date: today, time: '', address: '', city: '', gstNo: '', gstPer: '', items: [{ productId: '', amount: 0, qty: 0, rate: 0, finalAmount:0, gstPer:'0'}], netAmount: '', paymentMode: '', pincode: '', state: '', taxAmount: '', taxValue: '' })
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const param: Partial<GetAllParams> = {
        sortDirection: 'asc',
    }
    const [customerData, setCustomerData] = useState<CustomerData[]>([]);
    const [itemList, setItemListData] = useState<GetAllItemData[]>([]);
    const [rows, setRows] = useState<InvoiceProduct[]>([{ productId: '', qty: 1, rate: 0, amount: 0,finalAmount:0, gstPer:'0'}]);

    const validateSchema = Yup.object().shape({
        invoicePrefix: Yup.string().required('Prefix is required'),
        invoiceNumber: Yup.string().required('Invoice number is required'),
        date: Yup.string().required('Date is required'),
        dueDate: Yup.string().required('Due date is required'),
        customerId: Yup.string().required('Customer is required')
    })

    const handleItemChange = (index: number, itemId: string) => {
        const selectedItem = itemList.find((item) => item.productId === parseInt(itemId));
        if (!selectedItem) return;
        const newRows = [...rows];
        newRows[index].productId = itemId;

        const rate = selectedItem.sellingPrice ?? 0;
        const qty = newRows[index].qty ?? 1;

        newRows[index].rate = rate;
        newRows[index].amount = rate * newRows[index].qty;
        setRows(newRows);
    };

    const handleQtyChange = (index: number, qty: number) => {
        const newRows = [...rows];
        newRows[index].qty = qty;
        newRows[index].amount = qty * newRows[index].rate;
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { productId: "", qty: 1, rate: 0, amount: 0,finalAmount:0, gstPer:'0'}]);
    };

    const handleRemoveRow = (index: number) => {
        const newRows = [...rows];
        newRows.splice(index, 1);
        setRows(newRows);
    };

    const total = rows.reduce((sum, r) => sum + r.amount, 0);

    useEffect(() => {
        const invoiceDate = new Date(invoiceData.date);
        let dueDT = new Date(invoiceDate);

        switch (term) {
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

        setInvoiceData((prev) => ({ ...prev, dueDate: formatDate(dueDT) }))

    }, [term, invoiceData.date])

    useEffect(() => {
        getAllCustomer();
        getAll();
    }, [])

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

    return (
        <Layout>
            <div className='w-full flex flex-col  items-center'>

                <h1 className="text-3xl font-bold text-center text-black mb-10">Generate Invoice</h1>
                <div className='w-[95%] border rounded-md items-start bg-white p-5 mb-5'>
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
                        {/* <div className="sm:col-span-1">
                            <CustomLabel title='Company Name' />
                            <div className="relative w-full mt-1">
                                <select
                                    value={invoiceData.companyName}
                                    onChange={(e) => {
                                        setInvoiceData({ ...invoiceData, companyName: e.target.value })
                                    }}
                                    className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                >
                                    <option value="">Select Company</option>
                                    {companies.map((company: string, index: number) => (
                                        <option key={index} value={company}>
                                            {company}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div> */}
                        <TextField label='Invoice Date' name='date' type='date' value={invoiceData.date} onChange={(e) => { setInvoiceData({ ...invoiceData, date: e.target.value }) }} />
                        {/* <TextField label='Time' type='time' value={invoiceData.time} onChange={(e) => { setInvoiceData({ ...invoiceData, time: e.target.value }) }} /> */}
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
                        {/* <TextField label='Customer Name' name='customerName' type='text' value={invoiceData.clientName} onChange={(e) => { setInvoiceData({ ...invoiceData, clientName: e.target.value }) }} /> */}

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


                            {/* <button
                                type="button"
                                onClick={() => setInvoiceData((prev) => ({
                                    ...prev,
                                    items: [
                                        ...prev.items,
                                        { productId: "", amount: "", qty: "", rate: "" }
                                    ]
                                }))}
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 font-inter"
                            >
                                + Add Item
                            </button> */}
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
                        {/* {invoiceData.items.map((item: InvoiceProduct, index: number) => (
                            <div
                                key={index}
                                className="relative bg-gray-50 p-4 rounded-lg border mb-4"
                            >
                                <button
                                    type="button"
                                    // onClick={() => remove(index)}
                                    onClick={() => {
                                        const updateItems = [...invoiceData.items];
                                        updateItems.splice(index, 1);
                                        setInvoiceData({ ...invoiceData, items: updateItems });
                                    }}
                                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                    title="Remove item"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
                                    <div className="w-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <select
                                            value={item.productId}
                                            onChange={(e) => {
                                                const selectedProduct = itemList.find(p => p.productId === parseInt(e.target.value));
                                                const updateItems = [...invoiceData.items];
                                                updateItems[index].productId = parseInt(e.target.value).toString();
                                                updateItems[index].rate = selectedProduct?.rate || 0; // Auto-fill rate
                                                setInvoiceData({ ...invoiceData, items: updateItems });
                                            }}
                                            className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-900 focus:outline-none focus:border-blue-500 sm:text-sm"
                                        >
                                            <option value="">Select Product</option>
                                            {itemList.map((product) => (
                                                <option key={product.productId} value={product.productId}>
                                                    {product.productName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    <TextField label="Quantity" name='quantity' type="number" value={item.qty} onChange={(e) => {
                                        const updateItems = [...invoiceData.items];
                                        updateItems[index].qty = e.target.value;
                                        setInvoiceData({ ...invoiceData, items: updateItems });
                                    }} />
                                    <TextField label="Rate" name='rate' type="number" value={item.rate} onChange={(e) => {
                                        const updateItems = [...invoiceData.items];
                                        updateItems[index].rate = e.target.value;
                                        setInvoiceData({ ...invoiceData, items: updateItems });
                                    }} />
                                </div>
                            </div>
                        ))} */}

                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                        <TextField label='Tax Value' name='taxValue' type='text' value={invoiceData.taxValue} onChange={(e) => { setInvoiceData({ ...invoiceData, taxValue: e.target.value }) }} />
                        <TextField label='GST' name='gst' type='text' value={invoiceData.gstPer} onChange={(e) => { setInvoiceData({ ...invoiceData, gstPer: e.target.value }) }} />
                        <TextField label='Tax Amount' name='taxAmount' type='text' value={invoiceData.taxAmount} onChange={(e) => { setInvoiceData({ ...invoiceData, taxAmount: e.target.value }) }} />
                        <TextField label='Net Amount' name='netAmount' type='text' value={invoiceData.netAmount} onChange={(e) => { setInvoiceData({ ...invoiceData, netAmount: e.target.value }) }} />
                    </div> */}
                    <div className="mt-10 w-full flex items-center justify-center gap-5">
                        <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium font-inter shadow-lg">
                            Generate
                        </button>
                        <button type="submit" className="w-full md:w-auto  bg-[#03508C] text-white hover:bg-[#0874CB] px-6 py-2 rounded-lg font-medium font-inter transition-colors shadow-lg">
                            Cancel
                        </button>
                    </div>

                </div>
            </div>

            {/* <PreviewInvoice invoiceData={invoiceData} /> */}
        </Layout>
    )
}

export default GenerateInvoice