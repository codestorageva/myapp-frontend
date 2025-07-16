'use client'
import TextField from '@/app/component/inputfield'
import CustomLabel from '@/app/component/label'
import { ErrorMessage, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import Select, { components, GroupBase } from 'react-select';
import { BillProduct } from './bill'
import { GetAllItemData, getAllItems, GetAllParams } from '@/app/(pages)/items/items'
import { useRouter } from 'next/navigation'
import { group } from 'console'
import { parse } from 'path'
import { CustomerData, fetchAllCustomer } from '@/app/(pages)/customer/customer'
import * as Yup from "yup";

const CreateBill = () => {

  const vendors = ['Jay Shah', 'Niya Desai']
  const today = new Date().toISOString().split('T')[0];
  const dueDate = new Date().toISOString().split('T')[0];
  const [billData, setBillData] = useState({ vendorName: '', billId: '', orderNo: '', billDate: today, paymentTerm: 'Due On Receipt', dueDate: dueDate, note: '' })
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const terms = ['Net 45', 'Net 60', 'Due On Receipt', 'Due end of the month', 'Due end of the next month', 'Custom']
  const [rows, setRows] = useState<BillProduct[]>([
    { productId: '', qty: 1, rate: 0, amount: 0, gstPer: '0', finalAmount: 0, taxPref: '', account: '' }
  ]);
  const [roundOff, setRoundOff] = useState<number>(0)
  const [selectedTaxType, setSelectedTaxType] = useState('TDS')

  const param: Partial<GetAllParams> = {
    sortDirection: 'asc'
  }
  const [itemList, setItemListData] = useState<GetAllItemData[]>([])
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const groupedOptions: GroupBase<any>[] = [
    {
      label: 'Other Current Asset',
      options: [
        { value: 'advance_tax', label: 'Advance Tax' },
        { value: 'employee_advance', label: 'Employee Advance' },
        { value: 'prepaid_expenses', label: 'Prepaid Expenses' },
        { value: 'tds_receivable', label: 'TDS Receivable' }
      ],
    },
    {
      label: 'Fixed Asset',
      options: [
        { value: 'furniture', label: 'Furniture and Equipment' },
      ],
    },
    {
      label: 'Other Current Liability',
      options: [],
    },
  ];

  const validateSchema = Yup.object().shape({
    vendorName: Yup.string().required('Vendor Name is required'),
    billId: Yup.string().required('Bill Id is required'),
    billDate: Yup.string().required('Bill Date is required'),
    dueDate: Yup.string().required('Due date is required')
  })

  const tdsOption: GroupBase<any>[] = [
    {
      label: 'Taxes',
      options: [
        { value: 'Commission or Brokerage 2%', label: 'Commission or Brokerage [2%]' },
        { value: 'Commission or Brokerage (Reduced) 3.5%', label: 'Commission or Brokerage (Reduced) [3.5%]' },
        { value: 'Dividend 10%', label: 'Dividend [10%]' },
        { value: 'Dividend (Reduced) 7.5%', label: 'Dividend (Reduced) [7.5]%' },
        { value: 'Other Interest than securities 10%', label: 'Other Interest than securities [10%]' },
        { value: 'Other Interest than securities (Reduced) 10%', label: 'Other Interest than securities [10%]' },
        { value: 'Payment of contractors for Others 2%', label: 'Payment of contractors for Others [2%]' },
        { value: 'Payment of contractors for Others (Reduced) 2%', label: 'Payment of contractors for Others (Reduced) [2%]' }
      ]
    }
  ]

  useEffect(() => {
    getAll();
    getAllCustomer();
  }, [])

  const getAllCustomer = async () => {
    try {
      let res = await fetchAllCustomer(param as GetAllParams);
      if (res.success) {
        setCustomerData(res.data);
      }
      else {
        setCustomerData([])
      }
    }
    catch (e) { }
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
    setRows(newRows);
  }

  const handleQtyChange = (index: number, qty: number) => {
    const newRows = [...rows];
    newRows[index].qty = qty;
    newRows[index].amount = qty * newRows[index].rate;
    setRows(newRows);
  };

  const handleAddRow = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setRows([...rows, { productId: "", qty: 1, rate: 0, amount: 0, gstPer: "0", finalAmount: 0, taxPref: '', account: '' },]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  const gstGroupedTotals = rows.reduce((acc, row) => {
    let gst = parseFloat(row.gstPer?.replace('%', '') || '0');
    if (isNaN(gst)) gst = 0;

    if (!acc[gst]) {
      acc[gst] = {
        taxableAmount: 0,

      };
    }
    const taxable = row.amount || 0;
    acc[gst].taxableAmount += taxable;
    return acc;
  }, {} as Record<number, {
    taxableAmount: number;
  }>);

  const finalTotal = Object.values(gstGroupedTotals).reduce(
    (sum, group) => sum + group.taxableAmount,
    0
  );

  useEffect(() => {
    const finalAMT = Object.values(gstGroupedTotals).reduce((sum, group) => sum + group.taxableAmount, 0);
    const autoRound = Math.round(finalAMT) - finalAMT;
    setRoundOff(parseFloat(autoRound.toFixed(2)));
  }, [finalTotal, gstGroupedTotals])

  return (
    <>
      <div className='w-full flex flex-col items-center p-5'>
        <h1 className='text-3xl font-bold text-center text-black mb-10'>
          New Bill
        </h1>
        <div className='w-[100%] border rounded-md bg-white p-5'>
          <Formik
            initialValues={billData}
            validationSchema={validateSchema}
            onSubmit={(value) => {

            }}
          >
            {({ values, handleChange, setFieldValue, errors }) => (
              <Form>
                <div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div color='col-span-1'>
                      <CustomLabel title='Vendor Name' isCompulsory></CustomLabel>
                      <div className='flex gap-2'>
                        <select name="vendor" id="" value={values.vendorName}
                          onChange={(e) => {
                            setFieldValue('vendorName', e.target.value)
                          }}
                          className='block w-full rounded-md border bg-white focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter'
                        >
                          {
                            vendors.map((name: string, index: number) => (
                              <option key={index} value={name}>
                                {name}
                              </option>
                            ))
                          }
                        </select>

                      </div>
                      <ErrorMessage name="customerId" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    <div className='col-span-1'>
                      <TextField label='Bill #' name='billId' type='text' value={values.billId} onChange={handleChange} isCompulsory />
                      <ErrorMessage name="billId" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    <div className='col-span-1'>
                      <TextField label='Order Number' name='orderNo' type='text' value={values.orderNo} onChange={handleChange} />
                      <ErrorMessage name="orderNo" component="div" className="text-red-600 text-sm mt-1" />
                    </div>
                    <div className='col-span-1'>
                      <TextField label='Bill Date' name='billDate' type='date' value={values.billDate} onChange={handleChange} isCompulsory></TextField>
                      <ErrorMessage name='billDate' component='div' className='text-red-600 text-sm mt-1' />
                    </div>
                    <div className='col-span-1'>
                      <CustomLabel title='Payment Term' isCompulsory />
                      <div className='relative w-full mt-1'>
                        <select name='term' value={values.paymentTerm}
                          onChange={(e) => {
                            const selectedTerm = e.target.value;
                            setFieldValue('paymentTerm', selectedTerm)
                            const billDate = new Date(values.billDate);
                            let dueDate = new Date(billDate);
                            switch (selectedTerm) {
                              case 'Net 45':
                                dueDate.setDate(billDate.getDate() + 45);
                                break;
                              case 'Net 60':
                                dueDate.setDate(billDate.getDate() + 60);
                                break;
                              case 'Due end of the month':
                                dueDate = new Date(Date.UTC(billDate.getFullYear(), billDate.getMonth() + 1, 0));
                                break;
                              case 'Due end of the next month':
                                dueDate = new Date(Date.UTC(billDate.getFullYear(), billDate.getMonth() + 2, 0));
                                break;
                              case 'Due On Receipt':
                                dueDate = new Date(billDate);
                                break;
                              case 'Custom':
                                return;
                              default:
                                return;
                            }
                            console.log("Due Date : ", dueDate)
                            setFieldValue('dueDate', formatDate(dueDate))
                          }}
                          className='block w-full rounded-md border bg-white focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter'
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
                      <ErrorMessage name='dueDate' component='div' className='text-red-600 text-sm' />
                    </div>
                  </div>
                  <div className='mt-5 space-y-4'>
                    <div className='flex justify-between items-center'>
                      <h3 className='text-lg font-semibold text-gray-700 font-inter'>Items</h3>
                    </div>
                    <div>
                      <table className='min-w-full text-sm border border-gray-200 rounded overflow-hidden text-black'>
                        <thead className='bg-gray-100'>
                          <tr className='text-sm'>
                            <td className='px-3 py-2'>Item Details</td>
                            <td className='px-3 py-2'>Account</td>
                            <td className='px-3 py-2 w-[10%]'>Quantity</td>
                            <td className='px-3 py-2'>Rate</td>
                            <td className='px-3 py-2 text-right w-14'>GST</td>
                            <td className='px-3 py-2'>Customer Details</td>
                            <td className='px-3 py-2 text-right'>Amount</td>
                            <td className='px-3 py-2 w-10'></td>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((row: BillProduct, index: number) => (
                            <tr key={index} className='border-t border-gray-200'>
                              <td className='py-2'>
                                <select
                                  value={row.productId}
                                  onChange={(e) => handleItemChange(index, e.target.value)}
                                  className="w-full border bg-white py-1 focus:border-red-500 focus:ring-1 focus:ring-red-300  border-gray-300 rounded px-2 text-sm"
                                >
                                  <option value="">Select an item</option>
                                  {itemList.map((item: GetAllItemData) => (
                                    <option key={item.productId} value={item.productId}>
                                      {item.productName}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-2 relative z-10">
                                <div className="relative z-50">
                                   {hasMounted &&
                                (  <Select
                                    options={groupedOptions}
                                    placeholder="Select an account"
                                    isSearchable
                                    className="w-full border  bg-white focus:border-red-500 focus:ring-1 focus:ring-red-300  border-gray-300 rounded  text-sm"
                                    value={
                                      groupedOptions
                                        .flatMap((group) => group.options)
                                        .find((option) => option.value === row.account) || null
                                    }
                                    onChange={(selectedOption) => {
                                      const updatedRows = [...rows];
                                      updatedRows[index].account = selectedOption?.value || '';
                                      setRows(updatedRows);
                                    }}
                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                    // menuPortalTarget={document.body}

                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        minHeight: '28px', // reduce height of select input
                                        height: '28px',
                                        fontSize: '0.875rem',
                                        border: 'none'
                                      }),
                                      valueContainer: (base) => ({
                                        ...base,
                                        padding: '0 8px',
                                        height: '28px',
                                      }),
                                      indicatorsContainer: (base) => ({
                                        ...base,
                                        height: '28px',
                                      }),
                                      option: (base) => ({
                                        ...base,
                                        paddingTop: '6px',
                                        paddingBottom: '6px',
                                        fontSize: '0.875rem',
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  /> )}
                                </div>
                              </td>
                              <td className="p-2 text-right">
                                <input
                                  type="number"
                                  className="w-full focus:border-red-500 focus:ring-1 focus:ring-red-300 bg-white text-right border rounded px-2 py-1"
                                  value={row.qty}

                                  onChange={(e) => {
                                    if (e.target.value.includes('.')) return;
                                    const value = e.target.value;
                                    handleQtyChange(index, value === '' ? 1 : parseFloat(value))
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
                              <td className="p-2 text-right"><input
                                type="number"
                                placeholder="0"
                                className="w-full border rounded   focus:border-red-500 focus:ring-1 focus:ring-red-300 bg-white px-2 py-1 text-right"
                                value={row.rate === 0 ? 0 : row.rate}
                                // value={row.rate}
                                onChange={(e) => {
                                  const value = e.target.value;

                                  const updatedRows = [...rows];

                                  if (value === '') {
                                    updatedRows[index].rate = 0;
                                    updatedRows[index].amount = 0;
                                  } else {
                                    const parsed = parseFloat(value);
                                    updatedRows[index].rate = isNaN(parsed) ? 0 : parsed;
                                    updatedRows[index].amount =
                                      updatedRows[index].rate * (updatedRows[index].qty || 0);
                                  }

                                  setRows(updatedRows);
                                }}
                              />
                              </td>
                              <td className='p-2 text-right '>
                                <div className="w-full border bg-white py-1 focus:border-red-500 focus:ring-1 focus:ring-red-300  border-gray-300 rounded px-2 text-sm">{row.gstPer === 'NaN%' ? '0%' : row.gstPer}</div>

                              </td>
                              <td className='p-2'>
                                <select
                                  name="customerId"
                                  value={row.customerId || ''}
                                  onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selectedCustomer = customerData.find(
                                      (c) => c.customerId.toString() === selectedId
                                    );

                                    const updatedRows = [...rows];
                                    updatedRows[index].customerId = selectedCustomer?.customerId.toString();
                                    updatedRows[index].customerName = selectedCustomer?.firstName + ' ' + selectedCustomer?.lastName;
                                    setRows(updatedRows);
                                  }}
                                  className="w-full border bg-white py-1 focus:border-red-500 focus:ring-1 focus:ring-red-300  border-gray-300 rounded px-2 text-sm"
                                >
                                  <option value="">Select Customer</option>
                                  {customerData.map((customer) => (
                                    <option key={customer.customerId} value={customer.customerId}>
                                      {customer.firstName + ' ' + customer.lastName}
                                    </option>
                                  ))}
                                </select>

                              </td>
                              <td className="p-2 text-right font-semibold flex-col">
                                ₹ {row.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}

                              </td>
                              <td className="text-center">
                                <button type='button' onClick={() => handleRemoveRow(index)} className="text-red-500 text-sm hover:underline">✖</button>
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
                      {/* <div className='mt-4 flex flex-wrap justify-between items-end gap-4'>
                        <div className='flex flex-col gap-4'>
                          <div className='bg-gray-100 p-2 rounded-md border border-gray-300'>
                            <table className='min-w-full table-auto text-black'>
                              <thead>
                                <tr className='bg-gray-100'>
                                  <td className='py-2 text-left text-sm'>GST Rate</td>
                                  <td className='px-4 py-2 text-left text-sm'>Taxable Amount (₹)</td>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  Object.entries(gstGroupedTotals).map(([gstRate, data]) => (
                                    <tr key={gstRate} className='bg-white hover:bg-gray-50'>
                                      <td className='px-4 py-2 text-sm'>{gstRate}%</td>
                                      <td className='px-4 py-2 text-sm'>{data.taxableAmount.toFixed(2)}</td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className='bg-gray-100 p-4 rounded-md border border-gray-300 w-full max-w-md'>
                            <div className='flex justify-between'>
                                <h4 className='text-base font-semibold mb-2 text-gray-700'>Sub Total</h4>
                                <div>
                                    ₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.taxableAmount, 0).toFixed(2)}
                                </div>
                            </div>
                            <div className='flex justify-between text-sm text-gray-800 mt-2'>
                                <div>Round Off</div>
                                <div>
                                  <input type="number" className='border px-2 py-1 w-24 rounded text-right' value={roundOff.toFixed(2)} onChange={(e)=>{
                                    const value = parseFloat(e.target.value);
                                    setRoundOff(isNaN(value)?.0 : value)
                                  }} />
                                </div>
                            </div>
                        </div>
                      </div> */}
                      <div className='mt-4 flex flex-wrap justify-between items-end gap-4'>
                        <div className='w-[700px]'>
                          <label htmlFor="" className='block text-sm font-medium text-gray-700 mb-1'>
                            Notes
                          </label>
                          <textarea
                            id="narration"
                            rows={5}
                            value={values.note}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-blue-500 text-sm"
                            placeholder="Enter remarks or narration here..."
                          ></textarea>
                        </div>
                        <div className="ml-auto w-full max-w-md">
                          <div className='bg-gray-100 p-4 rounded-md border border-gray-300 w-full'>
                            <div className='flex justify-between'>
                              <h4 className='text-base font-semibold mb-2 text-gray-700'>Sub Total</h4>
                              <div>
                                ₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.taxableAmount, 0).toFixed(2)}
                              </div>
                            </div>

                            <div className='flex items-start gap-4 flex-wrap text-sm text-gray-800 mt-1'>

                              {/* TDS Radio */}
                              <label className='flex items-center gap-1 cursor-pointer'>
                                <input
                                  type="radio"
                                  name="taxType"
                                  value="TDS"
                                  checked={selectedTaxType === "TDS"}
                                  onChange={(e) => setSelectedTaxType(e.target.value)}
                                  className="accent-red-600"
                                />
                                TDS
                              </label>

                              {/* TCS Radio */}
                              <label className='flex items-center gap-1 cursor-pointer'>
                                <input
                                  type="radio"
                                  name="taxType"
                                  value="TCS"
                                  checked={selectedTaxType === "TCS"}
                                  onChange={(e) => setSelectedTaxType(e.target.value)}
                                  className="accent-red-600"
                                />
                                TCS
                              </label>

                              {/* Dropdown aligned to top */}
                              {selectedTaxType === 'TDS' && hasMounted && (
                                <div className="flex flex-col gap-1 w-[170px]">
                                  <Select
                                    options={tdsOption}
                                    placeholder="Select an account"
                                    isSearchable
                                    menuPosition="fixed"
                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                    className="text-xs bg-white border border-gray-300 rounded"
                                    value={
                                      tdsOption
                                        .flatMap((group) => group.options)
                                        .find((option) => option.value === selectedAccount) || null
                                    }
                                    onChange={(selectedOption) => {
                                      setSelectedAccount(selectedOption?.value || '');
                                    }}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        minHeight: '28px',
                                        height: '28px',
                                        fontSize: '0.75rem',
                                        border: 'none',
                                      }),
                                      valueContainer: (base) => ({
                                        ...base,
                                        padding: '0 8px',
                                        height: '28px',
                                      }),
                                      indicatorsContainer: (base) => ({
                                        ...base,
                                        height: '28px',
                                      }),
                                      option: (base) => ({
                                        ...base,
                                        paddingTop: '4px',
                                        paddingBottom: '4px',
                                        fontSize: '0.75rem',
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        fontSize: '0.75rem',
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        fontSize: '0.75rem',
                                      }),
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                  />
                                  <span className="text-xs text-gray-700">{selectedAccount}</span>
                                </div>
                              )}
                            </div>
                            <div className='flex justify-between text-sm text-gray-800 mt-2'>
                              <div>Round Off</div>
                              <div>
                                <input
                                  type="number"
                                  className='border px-2 py-1 w-24 rounded text-right'
                                  value={roundOff.toFixed(2)}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    setRoundOff(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </div>
                            </div>
                            <div className='border-t mt-3 pt-2 font-bold text-gray-900 flex justify-between'>
                              <div>Grand Total</div>
                              <div>
                                ₹ {
                                  (finalTotal + roundOff).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>


                  <div className="mt-10 w-full flex items-center justify-center gap-5">
                    <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium font-inter shadow-lg">
                      Save
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
    </>
  )
}

export default CreateBill