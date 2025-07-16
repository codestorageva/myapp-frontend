'use client'
import CityDropDown from '@/app/(pages)/common/city_dropdown/page'
import StateDropDown from '@/app/(pages)/common/state_dropdown/page'
import CustomLabel from '@/app/component/label'
import { ErrorMessage } from 'formik'
import React, { FC, useEffect, useState } from 'react'


const AddressDetails: FC<any> = ({ values, handleChange, handleBlur, states, cities, setFieldValue }) => {
    const [sameAsBilling, setSameAsBilling] = useState(false)

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked
        setSameAsBilling(checked)
        if (checked) {
            setFieldValue("shippingAddressLine1", values.addressLine1)
            setFieldValue("shippingAddressLine2", values.addressLine2)
            setFieldValue("shippingAddressLine3", values.addressLine3)
            setFieldValue("shippingState", values.state1)
            setFieldValue("shippingCity", values.city1)
            setFieldValue("shippingPincode", values.pincode1)
        } else {
            setFieldValue("shippingAddressLine1", "")
            setFieldValue("shippingAddressLine2", "")
            setFieldValue("shippingAddressLine3", "")
            setFieldValue("shippingState", "")
            setFieldValue("shippingCity", "")
            setFieldValue("shippingPincode", "")
        }
    }

    // useEffect(() => {
    //     if (sameAsBilling) {
    //         setFieldValue("shippingAddressLine1", values.addressLine1)
    //         setFieldValue("shippingAddressLine2", values.addressLine2)
    //         setFieldValue("shippingAddressLine3", values.addressLine3)
    //         setFieldValue("shippingState", values.state1)
    //         setFieldValue("shippingCity", values.city1)
    //         setFieldValue("shippingPincode", values.pincode1)
    //     }
    // }, [values.addressLine1, values.addressLine2, values.addressLine3, values.state1, values.city1, values.pincode1, sameAsBilling])

    return (
        <div className='w-full mb-3'>
            <h1 className='font-inter underline font-bold'>Billing Address</h1>
            <div className='mt-3 grid grid-cols-3 gap-x-4 gap-y-2'>
                <div className="sm:col-span-1">
                    <CustomLabel title='Address Line 1' isCompulsory/>
                    <div className="mt-1">
                        <input type="address" name="addressLine1" autoComplete="given-name" value={values.addressLine1} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="addressLine1" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Address Line 2' />
                    <div className="mt-1">
                        <input type="address" name='addressLine2' autoComplete="given-name" value={values.addressLine2} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Address Line 3' />
                    <div className="mt-1">
                        <input type="address" name="addressLine3" autoComplete="given-name" value={values.addressLine3} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>


                <div className="sm:col-span-1">
                    <CustomLabel title='State' isCompulsory/>
                    <div className="relative w-full mt-1">
                        {/* <select
                            value={values.state1}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name='state1'
                            className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                        >
                            <option value="">Select State</option>
                            {states.map((state: string, index: number) => (
                                <option key={index} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select> */}
                        <StateDropDown
                            name='state1'
                            labelVisible={true}
                            selectedStateId={values.state1 ? parseInt(values.state1) : -1}
                            onValue={(stateId, selected) => {
                                console.log("state id ", stateId)

                                let id = stateId.stateId.toString()
                                // setCityDetails({ stateId: id, cityName: values.cityName });
                                // handleChange(selected);
                                if (id === "-1") {
                                    console.log("ID ------------", id)
                                    setFieldValue('state1', '');
                                    setFieldValue('city1', ''); 
                                } else {
                                    setFieldValue('state1', id);
                                    setFieldValue('city1', '');  
                                }
                            }}
                        />
                        <ErrorMessage name="state1" component="div" className="text-red-600 text-sm" />
                    </div>

                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='City' isCompulsory/>
                    <div className="relative w-full mt-1">
                        <CityDropDown
                            stateId={values.state1}
                            name='city1'
                            selectedCityId={parseInt(values.city1 ?? -1)}
                            labelVisible={false}
                            onValue={(city, selected) => {
                                let id = city.cityId.toString()
                                // setCityDetails({ stateId: id, cityName: values.cityName });
                                // handleChange(selected);
                                setFieldValue('city1', id);
                            }}
                        />
                        <ErrorMessage name="city1" component="div" className="text-red-600 text-sm" />
                    </div>

                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Pincode' isCompulsory/>
                    <div className="mt-1">
                        <input type="number" name='pincode1' autoComplete="given-name" value={values.pincode1} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="pincode1" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <h1 className='font-inter underline font-bold mt-5'>Shipping Address</h1>
            <div className="mt-2 mb-3 flex items-center gap-2">
                <input type="checkbox" id="sameAsBilling" checked={sameAsBilling} onChange={handleCheckboxChange} className='accent-red-600'/>
                <label htmlFor="sameAsBilling" className="font-inter text-sm text-gray-700">Same as Billing Address</label>
            </div>
            <div className='mt-3 grid grid-cols-3 gap-x-4 gap-y-2'>
                <div className="sm:col-span-1">
                    <CustomLabel title='Address Line 1' isCompulsory/>
                    <div className="mt-1">
                        <input type="address" name='shippingAddressLine1' autoComplete="given-name" value={values.shippingAddressLine1} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="shippingAddressLine1" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Address Line 2' />
                    <div className="mt-1">
                        <input type="address" name='shippingAddressLine2' autoComplete="given-name" value={values.shippingAddressLine2} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Address Line 3' />
                    <div className="mt-1">
                        <input type="address" name='shippingAddressLine3' autoComplete="given-name" value={values.shippingAddressLine3} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                    </div>
                </div>

                <div className="sm:col-span-1">
                    <CustomLabel title='State' isCompulsory/>
                    <div className="relative w-full mt-1">
                        {/* <select
                            value={values.shippingState}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name='shippingState'
                            className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                        >
                            <option value="">Select State</option>
                            {states.map((state: string, index: number) => (
                                <option key={index} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select> */}
                        <StateDropDown
                            name='shippingState'
                            labelVisible={false}
                            selectedStateId={values.shippingState ? parseInt(values.shippingState) : -1}
                            onValue={(stateId, selected) => {
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
                    <CustomLabel title='City' isCompulsory/>
                    <div className="relative w-full mt-1">
                        {/* <select
                            value={values.shippingCity}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name='shippingCity'
                            className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                        >
                            <option value="">Select City</option>
                            {cities.map((city: string, index: number) => (
                                <option key={index} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select> */}
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
                <div className="sm:col-span-1">
                    <CustomLabel title='Pincode' isCompulsory/>
                    <div className="mt-1">
                        <input type="number" name='shippingPincode' autoComplete="given-name" value={values.shippingPincode} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="shippingPincode" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddressDetails