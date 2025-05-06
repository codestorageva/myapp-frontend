import CustomLabel from '@/app/component/label'
import React, { FC } from 'react'

const BankDetails: FC<any> = ({ regDetails, setRegDetails }) => {
    return (
        <div className='w-full'>
            <div className='mt-5 grid grid-cols-3 gap-x-4 gap-y-3 mb-3'>
                <div className="sm:col-span-1">
                    <CustomLabel title='Account Holder Name' />
                    <div className="mt-1">
                        <input type="text" required autoComplete="given-name" value={regDetails.accountHolderName} onChange={(e) => setRegDetails({ ...regDetails, accountHolderName: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Bank Name' />
                    <div className="mt-1">
                        <input type="text" required autoComplete="given-name" value={regDetails.bankName} onChange={(e) => setRegDetails({ ...regDetails, bankName: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Branch Name' />
                    <div className="mt-1">
                        <input type="text" required autoComplete="given-name" value={regDetails.branchName} onChange={(e) => setRegDetails({ ...regDetails, branchName: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className='sm:col-span-1'>
                    <CustomLabel title='Account Number' />
                    <div className='mt-1'>
                        <input type='text' value={regDetails.accountNo} onChange={(e) => setRegDetails({ ...regDetails, accountNo: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className='sm:col-span-1'>
                    <CustomLabel title='IFSC Code' />
                    <div className='mt-1'>
                        <input type='text' value={regDetails.IFSC} onChange={(e) => setRegDetails({ ...regDetails, IFSC: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className='sm:col-span-1'>
                    <CustomLabel title='Bank Address' />
                    <div className='mt-1'>
                        <input type='text' value={regDetails.bankAddress} onChange={(e) => setRegDetails({ ...regDetails, bankAddress: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankDetails