'use client'
import Colors from '@/app/utils/colors';
import { useSearchParams } from 'next/navigation'
import React, { useRef } from 'react'

const ViewBill = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const invoiceRef = useRef<HTMLDivElement>(null);

    return (
        <div className='p-5'>
            <div className='text-black'>
                <div>
                    <div ref={invoiceRef} className='max-w-4xl mx-auto p-6 bg-white'>
                        <div className='flex items-stretch justify-between border'>
                            <div className="w-1/3 flex justify-center items-center">
                                <img
                                    src='/assets/images/logo.png'
                                    alt="Company Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </div>
                            <div className='w-2/3 px-3 py-3 text-sm'>
                                <h1>Vaistra Technologies</h1>
                                Pan Hatdi, kuber kastbhanjan, near railway station<br />
                                Porbandar - 360 575<br />
                                PH NO. 0286-2265777<br />
                                Gujarat
                            </div>
                        </div>
                        <div className='w-full justify-center px-3 py-1 flex border'>
                            <label htmlFor="" className='font-bold text-xl'>BILL</label>
                        </div>
                        <div className='grid grid-cols-2 text-sm border border-collapse'>
                            <div className='p-3 text-sm'>
                                Bill From: <span className={`text-sm text-[#af0000]`}>Jay Shah</span>
                            </div>
                            <div className='p-3 border-l border-gray-300 text-sm'>
                                <strong>Bill #:</strong> 1<br />
                                <strong>Order Number:</strong> 123<br />
                                <strong>Bill Date:</strong> 15/07/2025<br />
                                <strong>Due Date:</strong> 15/07/2025<br />
                                <strong>Terms: </strong>Due on Recipt
                            </div>
                        </div>
                        <div className='border border-gray-300'>
                            <table className='w-full text-sm'>
                                <thead className='bg-gray-100'>
                                    <tr className='border border-gray-300'>
                                        <th className='border-r p-2 text-center'>#</th>
                                        <th className='border-r p-2 text-center'>Item & Description</th>
                                        <th className='border-r p-2 text-center'>Customer Details</th>
                                        <th className='border-r p-2 text-center'>Qty</th>
                                        <th className='border-r p-2 text-center'>Rate</th>
                                        <th className='p-2 text-center'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className=''>
                                        <td className='p-2 border-r'>1</td>
                                        <td className='p-2 border-r'>Laptop</td>
                                        <td className='p-2 border-r'>Priyanka Kanakiya</td>
                                        <td className='p-2 border-r text-right'>1</td>
                                        <td className='p-2 border-r text-right'>59000.00</td>
                                        <td className='p-2 text-right'>59000.00</td>
                                    </tr>
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <tr className="" key={`empty-${i}`}>
                                            <td className="p-2 border-r text-center">&nbsp;</td>
                                            <td className="p-2 border-r">&nbsp;</td>
                                            <td className="p-2 border-r">&nbsp;</td>
                                            <td className="p-2 border-r">&nbsp;</td>
                                            <td className="p-2 border-r">&nbsp;</td>
                                            <td className="p-2">&nbsp;</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='grid grid-cols-2 text-sm border'>
                            <div className='col-span-1'></div>
                            <div className='col-span-1 p-3 space-y-2'>
                                <div className='px-2 flex justify-between text-sm text-gray-800'>
                                    <div>Sub Total </div>
                                    <div>₹ {('50000.00')}</div>
                                </div>
                                <div className='px-2 flex justify-between text-sm text-gray-800'>
                                    <div>Amount Withheld </div>
                                    <div className={`text-[${Colors.red}]`}>{('(-) 200.00')}</div>
                                </div>
                                <div className='px-2 flex justify-between text-sm text-gray-800'>
                                    <div>Total</div>
                                    <div>₹ 49800.00</div>
                                </div>
                                <div className='px-2 flex justify-between text-sm text-gray-800'>
                                    <div>Payment Made</div>
                                    <div className={`text-[${Colors.red}]`}>{('(-) 2000.00')}</div>
                                </div>
                                {/* <div className='px-2 flex justify-between text-sm py-2 bg-gray-100 text-gray-800'>
                                    <div>Balance Due</div>
                                    <div>
                                        ₹ 50000.00
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 text-sm bg-gray-100">
                                    <div className="col-span-1  border-l px-3 py-2">
                                        {/* GSTIN NO.: {companyData?.gstNumber} */}
                                    </div>
                                    <div className="col-span-1 border-r  px-3 overflow-x-auto">
                                        <div className="flex justify-between text-sm px-2 py-1">
                                            <div className='font-bold'>Balance Due</div>
                                            {/* <div>{Math.round(finalTotal - 0.5) === finalTotal ? '₹ 0.00' : (finalTotal - Math.round(finalTotal)).toFixed(2)}</div> */}
                                            <div className='font-bold'>₹ 47800.00</div>
                                        </div>
                                    </div>
                                </div>
                        <div className="grid grid-cols-4 border text-xs">
                            <div className="col-span-4 relative min-h-[8rem]">
                                <div className="absolute bottom-2 right-2 text-right">
                                    <p>Authorized Signature</p>
                                    <div className="border-t w-40 ml-auto mt-1"></div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ViewBill