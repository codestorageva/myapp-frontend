'use client'
import { Suspense } from 'react';
import CityDropDown from '@/app/(pages)/common/city_dropdown/page';
import StateDropDown from '@/app/(pages)/common/state_dropdown/page';
import { ContactPersons } from '@/app/(pages)/customer/customer';
import { getCompanyById } from '@/app/(pages)/dashboard-page/dashboard';
import TextField from '@/app/component/inputfield';
import CustomLabel from '@/app/component/label';
import { ErrorMessage, Form, Formik } from 'formik';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const VendorAdd = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const [vendorDetails, setVendorDetails] = useState({ salution: '', firstName: '', lastName: '', companyId: '', companyName: '', displayName: '', email: '', workPhone: '', mobileNo: '', pan: '', billingAttention: '', billingAddressLine1: '', billingAddressLine2: '', billingCity: '', billingState: '', billingPincode: '', shippingAttention: '', shippingAddressLine1: '', shippingAddressLine2: '', shippingCity: '', shippingState: '', shippingPincode: '', notes: '', paymentTerm: 'Due On Receipt', tds: 'Commission or Brokrage (2%)', accountHolderName: '', bankName: '', branchName: '', accountNo: '', IFSC: '', bankAddress: '' })
    const [contacts, setContacts] = useState<ContactPersons[]>([]); // <-- Start with EMPTY
    const [sameAsBilling, setSameAsBilling] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const terms = ['Net 45', 'Net 60', 'Due On Receipt', 'Due end of the month', 'Due end of the next month', 'Custom']
    const tds = ['Commission or Brokrage (2%)', 'Bank Interest', 'Interest on Securities']

    useEffect(() => {
        getCompanyDetails();
    }, [])
    const router = useRouter()
    const updateContact = (index: number, field: string, value: string) => {
        const updated = [...contacts]
        updated[index][field as keyof typeof updated[0]] = value
        setContacts(updated)
    }

    const addContact = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        // setContacts([...contacts, { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobileNumber: '' }])
        setContacts(prev => [
            ...prev,
            { salutation: '', firstName: '', lastName: '', email: '', workPhone: '', mobileNumber: '' }
        ]);
    }

    const removeContact = (index: number) => {
        const updated = [...contacts]
        updated.splice(index, 1)
        setContacts(updated)
    }

    const getCompanyDetails = async () => {
        try {

            const localCompanyId = localStorage.getItem('selectedCompanyId');
            if (!localCompanyId) {
                return;
            }

            const res = await getCompanyById(localCompanyId);
            console.log("===response data", res.data)
            if (res.success) {
                const updatedDetails = {
                    ...vendorDetails,
                    companyId: res.data.companyId.toString(),
                    companyName: res.data.companyName,
                };

                setVendorDetails(updatedDetails);

                // âœ… Now log immediately from updated object
                console.log("Company ID (updated) :", updatedDetails.companyId);
            } else {

            }
        } catch (err: any) {
            toast.error(err.toString())
        }
    };

    const handleCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
        values: typeof vendorDetails
    ) => {
        const checked = e.target.checked;

        if (checked) {
            setFieldValue('shippingAttention', values.billingAttention);
            setFieldValue('shippingAddressLine1', values.billingAddressLine1);
            setFieldValue('shippingAddressLine2', values.billingAddressLine2);
            setFieldValue('shippingCity', values.billingCity);
            setFieldValue('shippingState', values.billingState);
            setFieldValue('shippingPincode', values.billingPincode);
        } else {
            setFieldValue('shippingAttention', '');
            setFieldValue('shippingAddressLine1', '');
            setFieldValue('shippingAddressLine2', '');
            setFieldValue('shippingCity', '');
            setFieldValue('shippingState', '');
            setFieldValue('shippingPincode', '');
        }

        setSameAsBilling(checked);
    };

    return (
        <div className='w-full flex flex-col items-center p-5'>
            <h1 className='text-3xl font-bold text-center text-black mb-10'>{id !== '' ? 'Update Vendor Details' : 'Vendor Registration'}</h1>
            <div className='w-[100%] border rounded-md bg-white p-5 text-black'>
                <Formik
                    initialValues={vendorDetails}
                    enableReinitialize
                    onSubmit={(values) => { }}
                >
                    {({ setFieldValue, values, errors, touched, handleChange }) => (
                        <Form>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <div className='col-span-1'>
                                    <CustomLabel title="Salutation" isCompulsory={true} />
                                    <select className="w-full border bg-white rounded-md px-2 py-2 text-sm font-inter focus:ring-1 focus:ring-red-300" name='salutation' onChange={(e) => setFieldValue('salutation', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Dr.">Dr.</option>
                                    </select>
                                    <ErrorMessage name="salutation" component="div" className="text-red-600 text-sm mt-1" />
                                </div>

                                <div className='col-span-1'>
                                    <TextField label='First Name' name='firstName' value={values.firstName} onChange={handleChange} isCompulsory={true} />
                                    <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm mt-1" />
                                </div>

                                <div className='col-span-1'>
                                    <TextField label='Last Name' name='lastName' value={values.lastName} onChange={handleChange} isCompulsory={true} />
                                    <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                                <div className='col-span-1 md:col-span-1'>
                                    <TextField label='Company Name' name='companyName' value={values.companyName} onChange={handleChange} disabled={true} />
                                </div>

                                <div className='col-span-1 md:col-span-1'>
                                    <TextField label='Display Name' name='displayName' value={values.displayName} onChange={handleChange} isCompulsory={true} />
                                    <ErrorMessage name="displayName" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                                <div className='col-span-1 md:col-span-1'>
                                    <TextField label='Email' name='email' value={values.email} onChange={handleChange} isCompulsory={true} />
                                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                                <div className='col-span-1 md:col-span-1'>
                                    <TextField label='Work Phone' name='workPhone' value={values.workPhone} onChange={handleChange} isCompulsory={true} />
                                    <ErrorMessage name="workPhone" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                                <div className='col-span-1 md:col-span-1'>
                                    <TextField label='Mobile Number' name='mobileNo' value={values.mobileNo} onChange={handleChange} isCompulsory={true} type='number' />
                                    <ErrorMessage name="mobileNo" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                                <div className='col-span-1 md:col-span-1'>
                                    <TextField label='PAN' name='pan' value={values.pan} onChange={handleChange} isCompulsory={true} />
                                    <ErrorMessage name="pan" component="div" className="text-red-600 text-sm mt-1" />
                                </div>
                                <div className="sm:col-span-1">
                                    <CustomLabel title='Payment Term' />
                                    <div className="relative w-full mt-1">
                                        <select
                                            name="term"
                                            value={values.paymentTerm}
                                            onChange={(e) => {
                                                const selectedTerm = e.target.value; // Get the selected value from the event
                                                setFieldValue('paymentTerm', selectedTerm); // 
                                            }} // <- Formik way
                                            className="block bg-white w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-red-300 focus:ring-1 focus:ring-red-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                        >
                                            {terms.map((term: string, index: number) => (
                                                <option key={index} value={term}>
                                                    {term}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="sm:col-span-1">
                                    <CustomLabel title='TDS' />
                                    <div className="relative w-full mt-1">
                                        <select
                                            name="tds"
                                            value={values.tds}
                                            onChange={(e) => {
                                                const selectedTDS = e.target.value; // Get the selected value from the event
                                                setFieldValue('tds', selectedTDS); // 
                                            }} // <- Formik way
                                            className="block bg-white w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-red-300 focus:ring-1 focus:ring-red-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                                        >
                                            {tds.map((t: string, index: number) => (
                                                <option key={index} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <h2 className="text-base mb-1">Contact Persons</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm border border-gray-200 rounded overflow-hidden">
                                        <thead className="bg-gray-100">
                                            <tr className="text-sm">
                                                <td className="px-3 py-2">SALUTATION</td>
                                                <td className="px-3 py-2">FIRST NAME</td>
                                                <td className="px-3 py-2">LAST NAME</td>
                                                <td className="px-3 py-2">EMAIL</td>
                                                <td className="px-3 py-2">WORK PHONE</td>
                                                <td className="px-3 py-2">MOBILE</td>
                                                <td className="px-3 py-2 w-10"></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contacts.map((contact, index) => (
                                                <tr key={index} className="border-t border-gray-200">
                                                    <td className="px-1 py-2">
                                                        <select
                                                            value={contact.salutation}
                                                            onChange={(e) => updateContact(index, 'salutation', e.target.value)}
                                                            className="w-full bg-white border focus:outline-none focus:ring-1 focus:ring-red-300 border-gray-300 rounded px-2 py-1"
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Mr.">Mr.</option>
                                                            <option value="Mrs.">Mrs.</option>
                                                            <option value="Ms.">Ms.</option>
                                                            <option value="Dr.">Dr.</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input type="text" className="w-full bg-white  focus:ring-1 focus:ring-red-300 border border-gray-300 rounded px-2 py-1"
                                                            value={contact.firstName}
                                                            onChange={(e) => updateContact(index, 'firstName', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input type="text" className="w-full bg-white focus:ring-1 focus:ring-red-300 border border-gray-300 rounded px-2 py-1"
                                                            value={contact.lastName}
                                                            onChange={(e) => updateContact(index, 'lastName', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input type="email" className="w-full bg-white focus:ring-1 focus:ring-red-300 border border-gray-300 rounded px-2 py-1"
                                                            value={contact.email}
                                                            onChange={(e) => updateContact(index, 'email', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input type="text" className="w-full bg-white border focus:ring-1 focus:ring-red-300 border-gray-300 rounded px-2 py-1"
                                                            value={contact.workPhone}
                                                            onChange={(e) => updateContact(index, 'workPhone', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <input type="text" className="w-full bg-white border focus:ring-1 focus:ring-red-300 border-gray-300 rounded px-2 py-1"
                                                            value={contact.mobileNumber}
                                                            onChange={(e) => updateContact(index, 'mobileNumber', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        <button onClick={() => removeContact(index)} className="text-red-500 text-sm hover:underline">âœ–</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <button
                                    onClick={addContact}
                                    className="mt-4 flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-blue-100 rounded-md text-sm"
                                >
                                    Add Contact Person
                                </button>

                            </div>
                            {/* <h2 className="text-base mb-1 mt-3">Address</h2>
                            <div className='w-full mb-3'>
                                <h1 className='underline text-sm'>Billing Address</h1>
                                <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                    <div className="sm:col-span-1">
                                        <TextField label='Attention' name='billingAttention' value={values.billingAttention} onChange={handleChange} isCompulsory={true} />
                                        <ErrorMessage name="billingAttention" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Address Line 1' isCompulsory={true} />
                                        <div className="mt-1">
                                            <input type="address" name="billingAddressLine1" autoComplete="given-name" value={values.billingAddressLine1} onChange={handleChange} className="block bg-white w-full focus:ring-1 focus:ring-red-300 font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="billingAddressLine1" component="div" className="text-red-600 text-sm mt-1" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Address Line 2' />
                                        <div className="mt-1">
                                            <input type="address" name='billingAddressLine2' autoComplete="given-name" value={values.billingAddressLine2} onChange={handleChange} className="block bg-white w-full focus:ring-1 focus:ring-red-300 font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='State' isCompulsory={true} />
                                        <div className="relative w-full mt-1">
                                            <StateDropDown
                                                name='billingState'
                                                labelVisible={true}
                                                selectedStateId={values.billingState ? parseInt(values.billingState) : -1}
                                                onValue={(stateId, selected) => {
                                                    console.log("state id ", stateId)

                                                    let id = stateId.stateId.toString()
                                                    if (id === "-1") {
                                                        console.log("ID ------------", id)
                                                        setFieldValue('billingState', '');
                                                        setFieldValue('billingCity', '');
                                                    } else {
                                                        setFieldValue('billingState', id);
                                                        setFieldValue('billingCity', '');
                                                    }
                                                }}
                                            />
                                            <ErrorMessage name="billingState" component="div" className="text-red-600 text-sm" />

                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='City' isCompulsory={true} />
                                        <div className="relative w-full mt-1">
                                            <CityDropDown
                                                stateId={values.billingState}
                                                name='billingCity'
                                                selectedCityId={parseInt(values.billingCity ?? -1)}
                                                labelVisible={false}
                                                onValue={(city, selected) => {
                                                    let id = city.cityId.toString()
                                                    setFieldValue('billingCity', id);
                                                }}
                                            />
                                            <ErrorMessage name="billingCity" component="div" className="text-red-600 text-sm" />
                                        </div>

                                    </div>

                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Pincode' isCompulsory={true} />
                                        <div className="mt-1">
                                            <input type="number" name='billingPincode' autoComplete="given-name" value={values.billingPincode} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none focus:ring-1 focus:ring-red-300 bg-white border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="billingPincode" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                </div>
                                <h1 className='underline text-sm mt-4'>Shipping Address</h1>
                                <div className="mt-2 mb-3 flex items-center justify-start gap-2">
                                    <input
                                        type="checkbox"
                                        id="sameAsBilling"
                                        checked={sameAsBilling}
                                        onChange={(e) => handleCheckboxChange(e, setFieldValue, values)}
                                        className="w-3 h-3 accent-red-600"
                                    />
                                    <label htmlFor="sameAsBilling" className="font-inter text-sm text-gray-700">
                                        Same as Billing Address
                                    </label>
                                </div>

                                <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Attention' isCompulsory={true} />
                                        <div className="mt-1">
                                            <input type="text" name="shippingAttention" autoComplete="given-name" value={values.shippingAttention} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none bg-white focus:ring-1 focus:ring-red-300 border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                        </div>
                                        <ErrorMessage name="shippingAttention" component="div" className="text-red-600 text-sm" />

                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Address Line 1' isCompulsory={true} />
                                        <div className="mt-1">
                                            <input type="address" name='shippingAddressLine1' autoComplete="given-name" value={values.shippingAddressLine1} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none focus:ring-1 focus:ring-red-300 bg-white border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="shippingAddressLine1" component="div" className="text-red-600 text-sm" />

                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Address Line 2' />
                                        <div className="mt-1">
                                            <input type="address" name='shippingAddressLine2' autoComplete="given-name" value={values.shippingAddressLine2} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none bg-white focus:ring-1 focus:ring-red-300 border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='State' isCompulsory={true} />
                                        <div className="relative w-full mt-1">
                                            <StateDropDown
                                                name='shippingState'
                                                labelVisible={true}
                                                selectedStateId={values.shippingState ? parseInt(values.shippingState) : -1}
                                                onValue={(stateId, selected) => {
                                                    console.log("state id ", stateId)

                                                    let id = stateId.stateId.toString()
                                                    if (id === "-1") {
                                                        console.log("ID ------------", id)
                                                        setFieldValue('shippingState', '');
                                                        setFieldValue('shippingCity', '');
                                                    } else {
                                                        setFieldValue('shippingState', id);
                                                        setFieldValue('shippingCity', '');
                                                    }
                                                }}
                                            />
                                            <ErrorMessage name="shippingState" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='City' isCompulsory={true} />
                                        <div className="relative w-full mt-1">
                                            <CityDropDown
                                                stateId={values.shippingState}
                                                name='shippingCity'
                                                selectedCityId={parseInt(values.shippingCity ?? -1)}
                                                labelVisible={false}
                                                onValue={(city, selected) => {
                                                    let id = city.cityId.toString()
                                                    setFieldValue('shippingCity', id);
                                                }}
                                            />
                                            <ErrorMessage name="shippingCity" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>

                                    <div className="col-span-1 md:col-span-1">
                                        <CustomLabel title='Pincode' isCompulsory={true} />
                                        <div className="mt-1">
                                            <input type="number" name='shippingPincode' autoComplete="given-name" value={values.shippingPincode} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:ring-1 focus:ring-red-300 bg-white focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="shippingPincode" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                             */}
                            {/* <h2 className='text-base mb-1 mt-4'>Bank Details</h2>
                            <div>
                                <div className='grid grid-cols-3 gap-x-4 gap-y-3 mb-3'>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Account Holder Name' isCompulsory />
                                        <div className="mt-1">
                                            <input type="text" name='accountHolderName' autoComplete="given-name" value={values.accountHolderName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500 placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="accountHolderName" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Bank Name' isCompulsory />
                                        <div className="mt-1">
                                            <input type="text" name='bankName' autoComplete="given-name" value={values.bankName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500   placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="bankName" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <CustomLabel title='Branch Name' isCompulsory />
                                        <div className="mt-1">
                                            <input type="text" name='branchName' autoComplete="given-name" value={values.branchName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500  placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="branchName" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                    <div className='sm:col-span-1'>
                                        <CustomLabel title='Account Number' isCompulsory />
                                        <div className='mt-1'>
                                            <input type='text' name='accountNo' value={values.accountNo} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500  placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="accountNo" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                    <div className='sm:col-span-1'>
                                        <CustomLabel title='IFSC Code' isCompulsory />
                                        <div className='mt-1'>
                                            <input type='text' name='IFSC' value={values.IFSC} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500  placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="IFSC" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                    <div className='sm:col-span-1'>
                                        <CustomLabel title='Bank Address' isCompulsory />
                                        <div className='mt-1'>
                                            <input type='text' name='bankAddress' value={values.bankAddress} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500  placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                            <ErrorMessage name="bankAddress" component="div" className="text-red-600 text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div className="flex w-full flex-col gap-6 mt-3">
                                <Tabs defaultValue="address">
                                    <TabsList>
                                        <TabsTrigger value="address">Address</TabsTrigger>
                                        <TabsTrigger value="bankDetails">Bank Details</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="address">
                                        <div className='w-full'>
                                            <h1 className='underline text-sm'>Billing Address</h1>
                                            <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                                <div className="sm:col-span-1">
                                                    <TextField label='Attention' name='billingAttention' value={values.billingAttention} onChange={handleChange} isCompulsory={true} />
                                                    <ErrorMessage name="billingAttention" component="div" className="text-red-600 text-sm mt-1" />
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Address Line 1' isCompulsory={true} />
                                                    <div className="mt-1">
                                                        <input type="address" name="billingAddressLine1" autoComplete="given-name" value={values.billingAddressLine1} onChange={handleChange} className="block bg-white w-full focus:ring-1 focus:ring-red-300 font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="billingAddressLine1" component="div" className="text-red-600 text-sm mt-1" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Address Line 2' />
                                                    <div className="mt-1">
                                                        <input type="address" name='billingAddressLine2' autoComplete="given-name" value={values.billingAddressLine2} onChange={handleChange} className="block bg-white w-full focus:ring-1 focus:ring-red-300 font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='State' isCompulsory={true} />
                                                    <div className="relative w-full mt-1">
                                                        <StateDropDown
                                                            name='billingState'
                                                            labelVisible={true}
                                                            selectedStateId={values.billingState ? parseInt(values.billingState) : -1}
                                                            onValue={(stateId, selected) => {
                                                                console.log("state id ", stateId)

                                                                let id = stateId.stateId.toString()
                                                                // setCityDetails({ stateId: id, cityName: values.cityName });
                                                                // handleChange(selected);
                                                                if (id === "-1") {
                                                                    console.log("ID ------------", id)
                                                                    setFieldValue('billingState', '');
                                                                    setFieldValue('billingCity', '');
                                                                } else {
                                                                    setFieldValue('billingState', id);
                                                                    setFieldValue('billingCity', '');
                                                                }
                                                            }}
                                                        />
                                                        <ErrorMessage name="billingState" component="div" className="text-red-600 text-sm" />

                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='City' isCompulsory={true} />
                                                    <div className="relative w-full mt-1">
                                                        <CityDropDown
                                                            stateId={values.billingState}
                                                            name='billingCity'
                                                            selectedCityId={parseInt(values.billingCity ?? -1)}
                                                            labelVisible={false}
                                                            onValue={(city, selected) => {
                                                                let id = city.cityId.toString()
                                                                // setCityDetails({ stateId: id, cityName: values.cityName });
                                                                // handleChange(selected);
                                                                setFieldValue('billingCity', id);
                                                            }}
                                                        />
                                                        <ErrorMessage name="billingCity" component="div" className="text-red-600 text-sm" />
                                                    </div>

                                                </div>

                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Pincode' isCompulsory={true} />
                                                    <div className="mt-1">
                                                        <input type="number" name='billingPincode' autoComplete="given-name" value={values.billingPincode} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none focus:ring-1 focus:ring-red-300 bg-white border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="billingPincode" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                            </div>

                                            <h1 className='underline text-sm mt-4'>Shipping Address</h1>
                                            <div className="mt-2 mb-3 flex items-center justify-start gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="sameAsBilling"
                                                    checked={sameAsBilling}
                                                    onChange={(e) => handleCheckboxChange(e, setFieldValue, values)}
                                                    className="w-3 h-3 accent-red-600"
                                                />
                                                <label htmlFor="sameAsBilling" className="font-inter text-sm text-gray-700">
                                                    Same as Billing Address
                                                </label>
                                            </div>

                                            <div className='mt-2 grid grid-cols-1 md:grid-cols-3 gap-3'>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Attention' isCompulsory={true} />
                                                    <div className="mt-1">
                                                        <input type="text" name="shippingAttention" autoComplete="given-name" value={values.shippingAttention} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none bg-white focus:ring-1 focus:ring-red-300 border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                    </div>
                                                    <ErrorMessage name="shippingAttention" component="div" className="text-red-600 text-sm" />

                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Address Line 1' isCompulsory={true} />
                                                    <div className="mt-1">
                                                        <input type="address" name='shippingAddressLine1' autoComplete="given-name" value={values.shippingAddressLine1} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none focus:ring-1 focus:ring-red-300 bg-white border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="shippingAddressLine1" component="div" className="text-red-600 text-sm" />

                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Address Line 2' />
                                                    <div className="mt-1">
                                                        <input type="address" name='shippingAddressLine2' autoComplete="given-name" value={values.shippingAddressLine2} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none bg-white focus:ring-1 focus:ring-red-300 border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='State' isCompulsory={true} />
                                                    <div className="relative w-full mt-1">
                                                        <StateDropDown
                                                            name='shippingState'
                                                            labelVisible={true}
                                                            selectedStateId={values.shippingState ? parseInt(values.shippingState) : -1}
                                                            onValue={(stateId, selected) => {
                                                                console.log("state id ", stateId)

                                                                let id = stateId.stateId.toString()
                                                                // setCityDetails({ stateId: id, cityName: values.cityName });
                                                                // handleChange(selected);
                                                                if (id === "-1") {
                                                                    console.log("ID ------------", id)
                                                                    setFieldValue('shippingState', '');
                                                                    setFieldValue('shippingCity', '');
                                                                } else {
                                                                    setFieldValue('shippingState', id);
                                                                    setFieldValue('shippingCity', '');
                                                                }
                                                            }}
                                                        />
                                                        <ErrorMessage name="shippingState" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='City' isCompulsory={true} />
                                                    <div className="relative w-full mt-1">
                                                        <CityDropDown
                                                            stateId={values.shippingState}
                                                            name='shippingCity'
                                                            selectedCityId={parseInt(values.shippingCity ?? -1)}
                                                            labelVisible={false}
                                                            onValue={(city, selected) => {
                                                                let id = city.cityId.toString()
                                                                // setCityDetails({ stateId: id, cityName: values.cityName });
                                                                // handleChange(selected);
                                                                setFieldValue('shippingCity', id);
                                                            }}
                                                        />
                                                        <ErrorMessage name="shippingCity" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>

                                                <div className="col-span-1 md:col-span-1">
                                                    <CustomLabel title='Pincode' isCompulsory={true} />
                                                    <div className="mt-1">
                                                        <input type="number" name='shippingPincode' autoComplete="given-name" value={values.shippingPincode} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:ring-1 focus:ring-red-300 bg-white focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="shippingPincode" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </TabsContent>
                                    <TabsContent value="bankDetails">
                                        <div className='w-full'>
                                            <div className='grid grid-cols-3 gap-x-4 gap-y-3 mb-3'>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Account Holder Name' isCompulsory />
                                                    <div className="mt-1">
                                                        <input type="text" name='accountHolderName' autoComplete="given-name" value={values.accountHolderName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500 placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="accountHolderName" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Bank Name' isCompulsory />
                                                    <div className="mt-1">
                                                        <input type="text" name='bankName' autoComplete="given-name" value={values.bankName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500   placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="bankName" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <CustomLabel title='Branch Name' isCompulsory />
                                                    <div className="mt-1">
                                                        <input type="text" name='branchName' autoComplete="given-name" value={values.branchName} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500  placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="branchName" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                                <div className='sm:col-span-1'>
                                                    <CustomLabel title='Account Number' isCompulsory />
                                                    <div className='mt-1'>
                                                        <input type='text' name='accountNo' value={values.accountNo} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500  placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="accountNo" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                                <div className='sm:col-span-1'>
                                                    <CustomLabel title='IFSC Code' isCompulsory />
                                                    <div className='mt-1'>
                                                        <input type='text' name='IFSC' value={values.IFSC} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500  placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="IFSC" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                                <div className='sm:col-span-1'>
                                                    <CustomLabel title='Bank Address' isCompulsory />
                                                    <div className='mt-1'>
                                                        <input type='text' name='bankAddress' value={values.bankAddress} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-red-500  placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                                                        <ErrorMessage name="bankAddress" component="div" className="text-red-600 text-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                            <div className="sm:col-span-1 mt-3">
                                <CustomLabel title='Remarks/ Notes' isCompulsory={true} />
                                <div className="mt-1">
                                    <textarea
                                        name="notes"
                                        autoComplete="off"
                                        value={values.notes}
                                        onChange={handleChange}
                                        rows={4} // â† controls visible height
                                        placeholder="Enter notes..."
                                        className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    />
                                    <ErrorMessage name="notes" component="div" className="text-red-600 text-sm" />
                                </div>
                            </div>
                            <div className="w-full flex items-center justify-center gap-5 pt-5">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg"
                                >
                                    {id !== '' ? 'Update' : 'Submit'}
                                </button>
                                <button
                                    type="reset"
                                    className="w-full md:w-auto bg-[#03508C] text-white hover:bg-[#0874CB] px-6 py-2 rounded-lg font-medium shadow-lg"
                                    onClick={() => router.replace('/customer')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}
export default function VendorAddPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorAdd />
    </Suspense>
  );
}
