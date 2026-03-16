  'use client';
import Layout from '@/app/component/layout';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense } from 'react'
import { CustomerData, getCustomerById } from '../customer';
import Loader from '@/app/component/Loader/page';
import TextField from '@/app/component/inputfield';
import ViewCard from '@/app/component/view_card';
import { ROUTES } from '@/app/constants/routes';

const CustomerView = () => {

  const [customerData, setCustomerData] = useState<CustomerData>()
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (id !== '') {
      getCustomerDetails();
    }
  }, [])

  const getCustomerDetails = async () => {
    setIsLoading(true);

    try {
      const res = await getCustomerById({ id });
      if (res.success) {
        setCustomerData(res.data);
      } else {
        alert('Customer Details Not Found!')
      }
    }
    catch { }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='w-full flex flex-col items-center p-5'>
      {isLoading && <Loader isInside={true}></Loader>}
      <h1 className='text-2xl font-bold text-center text-black mb-8'>View Customer Detail</h1>
      <div className='w-[100%] border rounded-md bg-white p-5'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-3'>
          <ViewCard value={customerData?.customerType ?? ''} label='Customer Type' />
          <ViewCard value={customerData?.salutation + " " + customerData?.firstName + ' ' + customerData?.lastName} label='Full Name' />
          <ViewCard value={customerData?.companyName} label='Company Name' />
          <ViewCard value={customerData?.displayName} label='Display Name' />
          <ViewCard value={customerData?.email} label='Email'></ViewCard>
          <ViewCard value={customerData?.workPhone} label='Work Phone'></ViewCard>
          <ViewCard value={customerData?.mobileNumber} label='Mobile Number'></ViewCard>
          <ViewCard value={customerData?.pan} label='PAN Number'></ViewCard>
          <ViewCard value={customerData?.gstNumber} label='GST Number'></ViewCard>
          <ViewCard value={customerData?.placeOfSupplyStateName} label='Place Of Supply'></ViewCard>
          <ViewCard value={customerData?.vid} label='VID'></ViewCard>
        </div>

        {/* <div className='mt-3'>
            <h3 className='text-base mb-1 underline'>Contact Person</h3>
            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm border border-gray-200 rounded overflow-hidden'>
                <thead className='bg-gray-100'>
                  <tr className='text-sm'>
                    <td className='py-2'>SALUTAION</td>
                    <td className='py-2'>FIRST NAME</td>
                    <td className='py-2'>LAST NAME</td>
                    <td className='py-2'>EMAIL</td>
                    <td className='py-2'>WORK PHONE</td>
                    <td className='py-2'>MOBILE</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    customerData?.contactPersons?.map((contact, index) => (
                      <tr key={index} className='border-t border-gray-200 border-b'>
                        <td className='py-2'> <ViewCard value={contact.salutation}></ViewCard> </td>
                        <td className='py-2'> <ViewCard value={contact.firstName}></ViewCard></td>
                        <td className='py-2'> <ViewCard value={contact.lastName}></ViewCard> </td>
                        <td className='py-2'><ViewCard value={contact.email}></ViewCard></td>
                        <td className='py-2'><ViewCard value={contact.workPhone}></ViewCard></td>
                        <td className='py-2'> <ViewCard value={contact.mobileNumber}></ViewCard></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div> */}
        <div className='w-full mb-3'>
          <h3 className='text-base mb-1 underline'>Contact Person</h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-2">Salutation</th>
                  <th className="px-4 py-2">First Name</th>
                  <th className="px-4 py-2">Last Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Work Phone</th>
                  <th className="px-4 py-2">Mobile</th>
                </tr>
              </thead>
              <tbody>
                {customerData?.contactPersons?.map((contact, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2"><ViewCard value={contact.salutation} /></td>
                    <td className="px-4 py-2"><ViewCard value={contact.firstName} /></td>
                    <td className="px-4 py-2"><ViewCard value={contact.lastName} /></td>
                    <td className="px-4 py-2"><ViewCard value={contact.email} /></td>
                    <td className="px-4 py-2"><ViewCard value={contact.workPhone} /></td>
                    <td className="px-4 py-2"><ViewCard value={contact.mobileNumber} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <hr />
        <h3 className='text-base mb-1 mt-3 underline'>Address</h3>
        <div className='w-full mb-3'>
          <h3 className='text-sm font-semibold'>Billing Address</h3>
          <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-3'>
            <ViewCard label='Attention' value={customerData?.billingAttention}></ViewCard>
            <ViewCard label='Address Line 1' value={customerData?.billingAddressLine1}></ViewCard>
            <ViewCard label='Address Line 2' value={customerData?.billingAddressLine2}></ViewCard>
            <ViewCard label='State' value={customerData?.billingStateName}></ViewCard>
            <ViewCard label='City' value={customerData?.billingCityName}></ViewCard>
            <ViewCard label='Pincode' value={customerData?.billingPincode}></ViewCard>
          </div>
        </div>
        <div className='w-full mb-3'>
          <h3 className='text-sm font-semibold'>Shipping Address</h3>
          <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-3'>
            <ViewCard label='Attention' value={customerData?.shippingAttention}></ViewCard>
            <ViewCard label='Address Line 1' value={customerData?.shippingAddressLine1}></ViewCard>
            <ViewCard label='Address Line 2' value={customerData?.shippingAddressLine2}></ViewCard>
            <ViewCard label='State' value={customerData?.shippingStateName}></ViewCard>
            <ViewCard label='City' value={customerData?.shippingCityName}></ViewCard>
            <ViewCard label='Pincode' value={customerData?.shippingPincode}></ViewCard>
          </div>
        </div>
        <hr />
        <h3 className='text-base mb-1 mt-3 underline'>Invoices</h3>
        {
          customerData?.invoices !== null && customerData?.invoices.map((data, index) => (
            <div className='text-sm' key={index}>
              Invoice <a href={`${ROUTES.view_invoice}?id=${data.invoiceId}`} className='text-sm cursor-pointer text-blue-600'>{data.invoicePrefix + ' ' + data?.invoiceNumber}</a> of amount â‚¹ {data.grandTotal.toLocaleString('en-In', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} created
            </div>
          ))
        }
      </div>
    </div>
  )
}
export default function CustomerViewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomerView />
    </Suspense>
  );
}
