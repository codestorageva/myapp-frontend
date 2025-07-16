'use client';
import Layout from '@/app/component/layout'
import React, { useEffect, useState } from 'react'
import { getCompanyById } from '../../dashboard-page/dashboard';
import { CompanyData } from '../../../organization/main-dashboard/company-list';
import ViewCard from '@/app/component/view_card';
import CustomLabel from '@/app/component/label';
import Loader from '@/app/component/Loader/page';
import Colors from '@/app/utils/colors';

const CompanyProfile = () => {

    const [isLoading, setLoading] = useState(true)
    const [data, setData] = useState<CompanyData>()
    useEffect(() => {
       getCompanyDetails();
    }, [])

    const getCompanyDetails = async () => {
        try {
            setLoading(true);

            const localCompanyId = localStorage.getItem('selectedCompanyId');

            if (!localCompanyId) {
                alert('Company ID is missing.');
                return;
            }

            const res = await getCompanyById(localCompanyId);
            console.log("===response data", res.data)
            if (res.success) {
                setData(res.data);
            } else {
                alert('Failed to load company details.');
            }
        } catch (err) {
            alert('An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {isLoading && <Loader isInside={true}/>}
          {data &&  ( <div className='w-full flex flex-col items-center p-5 '>
                <h1 className='text-3xl font-bold text-center text-black'>Company Profile</h1>
                <div className="relative border rounded-md p-4 mt-6 w-full">
                    <div className={`absolute -top-2 left-3 bg-[${Colors.bodyColor}] px-2 text-sm font-semibold`}>
                        Personal Details
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <ViewCard value={data?.companyName} label={'Company Name'}></ViewCard>
                        <ViewCard value={data?.ownerName} label='Owner Name' />
                        <ViewCard value={data?.panNumber} label='PAN Number' />
                        <ViewCard value={data?.gstNumber} label='GST Numner' />
                        <ViewCard value={data?.industry} label='Industry' />
                        <ViewCard value={data?.password} label='Password' />
                        <div className='sm:col-span-1'>
                            <CustomLabel title='Logo' />
                            <a href={data?.logo} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={data?.logo}
                                    className="w-20 sm:w-24 md:w-28 lg:w-32 mt-1 h-auto rounded-md object-contain cursor-pointer"
                                    alt="Logo"
                                />
                            </a>
                        </div>
                        <ViewCard value={data?.mobileNumber} label='Phone No'/>
                    </div>
                </div>
                <div className="relative border rounded-md p-4 mt-6 w-full">
                    <div className={`absolute -top-2 left-3 bg-[${Colors.bodyColor}] px-2 text-sm font-semibold`}>
                        Address Details
                    </div>
                    {/* <label className='font-inter underline  text-sm'>Billing Address</label> */}
                    <h3 className='text-sm font-semibold'>Billing Address</h3>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <ViewCard value={data?.billingAddress1+' '+data?.billingAddress2+' '+data?.billingAddress3} label={'Address'}></ViewCard>
                        <ViewCard value={data?.billingCityName} label='City' />
                        <ViewCard value={data?.billingStateName} label='State' />
                        <ViewCard value={data?.billingPincode} label='Pincode' />
                    </div>
                    <h3 className='text-sm font-semibold mt-3'>Shipping Address</h3>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <ViewCard value={data?.shippingAddress1+' '+data?.shippingAddress2+' '+data?.shippingAddress3} label={'Address'}></ViewCard>
                        <ViewCard value={data?.shippingCityName} label='City' />
                        <ViewCard value={data?.shippingStateName} label='State' />
                        <ViewCard value={data?.shippingPincode} label='Pincode' />
                    </div>
                </div>
                <div className="relative border rounded-md p-4 mt-6 w-full">
                    <div className={`absolute -top-2 left-3 bg-[${Colors.bodyColor}] px-2 text-sm font-semibold`}>
                        Bank Details
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
                        <ViewCard value={data?.bankDetails[0].accHolderName} label={'Account Holder Name'}></ViewCard>
                        <ViewCard value={data?.bankDetails[0].bankName} label='Bank Name' />
                        <ViewCard value={data?.bankDetails[0].bankName} label='Branch Name' />
                        <ViewCard value={data?.bankDetails[0].accountNumber} label='Account Numner' />
                        <ViewCard value={data?.bankDetails[0].ifscCode} label='IFSC Code' />
                        <ViewCard value={data?.bankDetails[0].bankAddress} label='Bank Address' />
                    </div>
                </div>
            </div> )}

        </div>

    )
}

export default CompanyProfile