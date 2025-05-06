import CustomLabel from '@/app/component/label'
import { ErrorMessage } from 'formik'
import React, { FC } from 'react'

const BankDetails: FC<any> = ({ values, handleChange, handleBlur }) => {
    return (
        <div className='w-full'>
            <div className='mt-5 grid grid-cols-3 gap-x-4 gap-y-3 mb-3'>
                <div className="sm:col-span-1">
                    <CustomLabel title='Account Holder Name' />
                    <div className="mt-1">
                        <input type="text" name='accountHolderName' autoComplete="given-name" value={values.accountHolderName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="accountHolderName" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Bank Name' />
                    <div className="mt-1">
                        <input type="text" name='bankName' autoComplete="given-name" value={values.bankName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="bankName" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Branch Name' />
                    <div className="mt-1">
                        <input type="text" name='branchName' autoComplete="given-name" value={values.branchName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="branchName" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className='sm:col-span-1'>
                    <CustomLabel title='Account Number' />
                    <div className='mt-1'>
                        <input type='text' name='accountNo' value={values.accountNo} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="accountNo" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className='sm:col-span-1'>
                    <CustomLabel title='IFSC Code' />
                    <div className='mt-1'>
                        <input type='text' name='IFSC' value={values.IFSC} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="IFSC" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className='sm:col-span-1'>
                    <CustomLabel title='Bank Address' />
                    <div className='mt-1'>
                        <input type='text' name='bankAddress' value={values.bankAddress} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="bankAddress" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankDetails