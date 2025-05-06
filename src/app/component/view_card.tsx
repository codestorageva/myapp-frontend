import React from 'react'
import CustomLabel from './label';

interface ViewCardProps {
    label?: string;
    value?: string;
    isCompulsory?: boolean;
}

const ViewCard = ({ label, value, isCompulsory = false }: ViewCardProps) => {
    return (
        <div className="w-full">
            {label && (
                <CustomLabel title={label} isCompulsory={isCompulsory} />
            )}
            <label htmlFor="" className={`block w-full rounded-md  text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6  font-inter disabled:bg-white`}>{value}</label>
            {/* <input
                type='text'
                value={value ?? ''}
                onChange={(e)=>{}}
               
                disabled
                className={`block w-full rounded-md  text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6  mt-1 font-inter disabled:bg-white`}
            /> */}
        </div>
    )
}

export default ViewCard