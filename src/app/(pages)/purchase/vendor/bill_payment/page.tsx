'use client'
import TextField from '@/app/component/inputfield'
import CustomLabel from '@/app/component/label'
import { ErrorMessage, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import Select, { GroupBase } from 'react-select'

const BillPayment = () => {

  const today = new Date().toISOString().split('T')[0];
  const [billPaymentData, setBillPaymentData] = useState({ vendorId: '', vendorName: '', paymentId: '', paymentMade: '', paymentDate: today, paymentMode: '', paidThrough: '', reference: '', paymentMadeOn: today, payment: '0', amountPaid: 0, amountUsedPayment: 0, total: 0, amountExcess: 0 })
  const vendors = ['Jay Shah', 'Niya Desai']
  const paymentMode = ['Cash', 'Banking']
  const [isFullPayment, setIsFullPayment] = useState(false)
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  const paidThroughOption: GroupBase<any>[] = [
    {
      label: 'Cash',
      options: [
        { value: 'Petty Cash', label: 'Petty Cash' },
        { value: 'Undeposite Funds', label: 'Undeposite Funds' }
      ]
    },
    {
      label: 'Other Current Liability',
      options: [
        { value: 'Employee Reimbursements', label: 'Employee Reimbursements' },
        { value: 'TDS Payable', label: 'TDS Payable' }
      ]
    },
    {
      label: 'Equity',
      options: [
        { value: 'Capital Stock', label: 'Capital Stock' },
        { value: 'Distributions', label: 'Distributions' },
        { value: 'Dividends Paid', label: 'Dividends Paid' },
        { value: 'Drawings', label: 'Drawings' },
        { value: 'Investments', label: 'Investments' },
        { value: 'Opening Balance Offset', label: 'Opening Balance Offset' },
        { value: 'Owner\'s Equity', label: 'Owner\'s Equity' }
      ]
    },
    {
      label: 'Other Current Asset',
      options: [
        { value: 'Employee Advance', label: 'Employee Advance' },
        { value: 'TDS Receivable', label: 'TDS Receivable' }
      ]
    }
  ]


  return (
    <div className='w-full flex flex-col items-center p-5'>
      <h1 className='text-3xl font-bold text-center text-black mb-10'>Bill Payment</h1>
      <div className='w-[100%] border rounded-md bg-white p-5'>
        <Formik
          initialValues={billPaymentData}
          onSubmit={(value) => { }}
        >
          {({ values, handleChange, setFieldValue }) => (
            <Form>
              <div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='col-span-1'>
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
                    <ErrorMessage name="vendorName" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                  <div className='col-span-1'>
                    <TextField label='Payment #' name='paymentId' type='text' value={values.paymentId} onChange={handleChange} isCompulsory />
                    <ErrorMessage name='paymentId' component='div' className='text-red-600 text-sm mt-1' />
                  </div>
                  <div className='col-span-1'>
                    <TextField label='Payment Date' name='paymentDate' type='date' value={values.paymentDate} onChange={handleChange} isCompulsory />
                    <ErrorMessage name='paymentDate' component='div' className='text-red-600 text-sm mt-1' />
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
                  <div className='col-span-1'>
                    <CustomLabel title='Paid Through' />
                    <div className='flex gap-2'>
                      {/* <Select
                        options={paidThroughOption}
                        placeholder="Select an account"
                        isSearchable
                        className='block w-full rounded-md border bg-white focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter'
                        value={
                          paidThroughOption.flatMap((group) => group.options).find((option) => option.value === values.paidThrough) || null
                        }
                        onChange={(selectedOption) => {
                          setFieldValue('paidThrough', selectedOption?.value)
                        }}
                        // menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
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
                      /> */}
                      {hasMounted && (
                        <Select
                          options={paidThroughOption}
                          placeholder="Select an account"
                          isSearchable
                          className="block w-full rounded-md border bg-white focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                          value={
                            paidThroughOption.flatMap((group) => group.options).find((option) => option.value === values.paidThrough) || null
                          }
                          onChange={(selectedOption) => {
                            setFieldValue('paidThrough', selectedOption?.value)
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              minHeight: '28px',
                              height: '28px',
                              fontSize: '0.875rem',
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
                              paddingTop: '6px',
                              paddingBottom: '6px',
                              fontSize: '0.875rem',
                            }),
                            menuPortal: (base) => ({
                              ...base,
                              zIndex: 9999,
                            }),
                          }}
                        />
                      )}

                    </div>
                  </div>
                  <div className='col-span-1'>
                    <TextField label='Reference#' type='text' value={values.reference} name='reference' onChange={handleChange} />
                  </div>
                  <div className='col-span-1'>
                    <TextField
                      label='Payment Made'
                      name='paymentMade'
                      type='number'
                      isCompulsory
                      value={values.paymentMade}
                      onChange={(e) => {
                        const input = e.target.value

                        const parsed = parseFloat(input)
                        if (!isNaN(parsed)) {
                          setFieldValue('paymentMade', parsed)
                          setFieldValue('amountPaid', parsed)
                          setFieldValue('amountExcess', parsed)
                        } else if (input === '') {
                          setFieldValue('paymentMade', '')
                          setFieldValue('amountPaid', '')
                          setFieldValue('amountExcess', 0)
                        }
                      }}
                    />
                    <div>
                      <input type='checkbox' className='accent-red-600' checked={isFullPayment} onChange={(e) => {
                        const checked = e.target.checked;
                        setIsFullPayment(checked);

                        if (checked) {
                          const fullAmount = '2100';
                          setFieldValue('paymentMade', fullAmount);
                          setFieldValue('payment', fullAmount);
                          setFieldValue('amountPaid', 2100);
                          setFieldValue('amountUsedPayment', 2100);
                          setFieldValue('total', fullAmount)
                        } else {
                          setFieldValue('paymentMade', '');
                          setFieldValue('payment', '0');
                          setFieldValue('amountPaid', 0);
                          setFieldValue('amountUsedPayment', 0)
                          setFieldValue('total', 0)
                        }
                      }} /> <span className='text-sm'>Pay full amount</span>

                    </div>
                  </div>
                </div>
                <div className='w-full mt-3'>
                  <table className='w-full text-sm table-auto border-b border-spacing-y-2 border-separate'>
                    <thead>
                      <tr className='text-gray-600 bg-gray-100'>
                        <th className='py-2 px-2'>Date</th>
                        <th className='py-2 px-2'>Bill#</th>
                        <th className='py-2 px-2 text-right'>Bill Amount</th>
                        <th className='py-2 px-2 text-right'>Amount Due</th>
                        <th className='py-2 px-2 text-right'>Payment Made on</th>
                        <th className='py-2 px-2 text-right'>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='px-2 flex-col flex'>
                          <span>09/07/2025</span>
                          <span className='text-xs'>Due Date: 24/07/2025</span>
                        </td>
                        <td className='px-2'>
                          111
                        </td>
                        <td className='px-2 text-right'>
                          50000.00
                        </td>
                        <td className='px-2 text-right'>
                          50000.00
                        </td>
                        <td className='px-2'>
                          <TextField name='paymentMade' type='date' value={values.paymentMadeOn} className='text-right' onChange={handleChange} />
                        </td>
                        <td className='px-2'>
                          <TextField
                            name='payment'
                            type='number'
                            value={values.payment}
                            className='text-right'
                            onChange={(e) => {
                              setFieldValue('payment', e.target.value)
                              setFieldValue('amountUsedPayment', e.target.value)
                            }}
                            onBlur={() => {
                              // const paymentMade = parseFloat(values.paymentMade || 0);
                              // const payment = parseFloat(values.payment || 0);
                              // const excess = paymentMade - payment;
                              // setFieldValue('amountExcess', excess);

                              const paymentMade = parseFloat(values.paymentMade || '0');
                              const payment = parseFloat(values.payment || '0');
                              const excess = paymentMade - payment;
                              setFieldValue('amountExcess', excess)
                            }}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex justify-end w-full mt-2 border-b pb-2">
                    <div className="flex gap-2 text-sm  text-gray-900">
                      <span>Total </span>
                      <span>₹ {Number(values.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  {/* <div className='mt-4 flex flex-wrap justify-between items-end gap-4'>

                    <div className="ml-auto w-full max-w-md">
                      <div className='bg-red-50 p-4 rounded-md border space-y-2 border-red-300 w-full'>
                          <div className='flex justify-between text-sm text-gray-800'>
                            <div>Amount Paid</div>
                            <div>0.00</div>
                          </div>
                          <div className='flex justify-between text-sm text-gray-800'>
                            <div>Amount Used Payments</div>
                            <div>0.00</div>
                          </div>
                          <div className='flex justify-between text-sm text-gray-800'>
                            <div>Amount Refunded</div>
                            <div>0.00</div>
                          </div>
                          <div className='flex justify-between text-sm text-gray-800'>
                            <div>Amount in Excess</div>
                            <div>0.00</div>
                          </div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 w-full space-y-2">
                        <div className="grid grid-cols-2 text-sm text-gray-800">
                          <div className="text-right pr-2">Amount Paid:</div>
                          <div className="text-right">{Number(values.amountPaid || 0).toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-2 text-sm text-gray-800">
                          <div className="text-right pr-2">Amount used for Payments:</div>
                          <div className="text-right">{Number(values.amountUsedPayment || 0).toFixed(2)}</div>
                        </div>
                        <div className="grid grid-cols-2 text-sm text-gray-800">
                          <div className="text-right pr-2">Amount Refunded:</div>
                          <div className="text-right">0.00</div>
                        </div>
                        <div className="grid grid-cols-2 text-sm text-gray-800 items-center">
                          <div className="text-right pr-2 flex justify-end items-center gap-1 text-orange-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01M12 5c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z"
                              />
                            </svg>
                            <span className='text-gray-800'>Amount in Excess:</span>
                          </div>
                          <div className="text-right font-medium text-black">₹ {Number(values.amountExcess || 0).toFixed(2)}</div>
                        </div>
                      </div>
                      

                    </div>
                  </div> */}
                  <div className='w-full mt-3'>
                    <table className='w-full text-sm table-auto border-spacing-0-y-2'>
                      <thead>
                        <tr className='text-gray-600 bg-gray-100'>
                          <th className='py-2 px-2'>Amount Paid</th>
                          <th className='py-2 px-2'>Amount used for Payments</th>
                          {/* <th className='py-2 px-2'>Amount Refunded</th> */}
                          <th className='py-2 px-2'>Amount in Excess</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className='py-2 px-2'>{Number(values.amountPaid || 0).toFixed(2)}</td>
                          <td className='py-2 px-2'>{Number(values.amountUsedPayment || 0).toFixed(2)}</td>
                          {/* <td className='py-2 px-2'>0.00</td> */}
                          <td className='py-2 px-2'>{Number(values.amountExcess || 0).toFixed(2)}</td>
                        </tr>
                      </tbody>

                    </table>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default BillPayment