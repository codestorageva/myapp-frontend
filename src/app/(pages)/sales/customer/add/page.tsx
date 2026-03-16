'use client'
import { Suspense } from 'react';
import TextField from '@/app/component/inputfield'
import CustomLabel from '@/app/component/label'
import Layout from '@/app/component/layout'
import Colors from '@/app/utils/colors'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getCompanyById } from '../../../dashboard-page/dashboard'
import { toast } from 'react-toastify'
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from 'formik'
import StateDropDown from '../../../common/state_dropdown/page'
import CityDropDown from '../../../common/city_dropdown/page'
import { AddCustomerRequest, addNewCustomer, ContactPersons, getCustomerById, updateCustomer } from '../customer'

const Customer = () => {
  const [customerType, setType] = useState('Business')
  const [contacts, setContacts] = useState<ContactPersons[]>([]); // <-- Start with EMPTY
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';


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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh']
  const cities = ['Ahmedabad', 'Surat', 'Baroda', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Porbandar', 'Morbi', 'Nadiad', 'Bharuch', 'Vapi', 'Ankleshwar', 'Patan', 'Mehsana', 'Bhuj', 'Palanpur', 'Veraval', 'Surendranagar']
  const [customerReg, setRegDetails] = useState({ companyId: '', salutation: '', firstName: '', lastName: '', companyName: '',vid:'',  displayName: '', email: '', workPhone: '', mobileNo: '', pan: '', gstNo: '', billingAttention: '', billingAddressLine1: '', billingAddressLine2: '', billingCity: '', billingState: '', billingPincode: '', shippingAttention: '', shippingAddressLine1: '', shippingAddressLine2: '', shippingCity: '', shippingState: '', shippingPincode: '', placeOfSupply: '', terms: ''})

  const [sameAsBilling, setSameAsBilling] = useState(false)

  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const checked = e.target.checked;

  //   if (checked) {
  //     setRegDetails(prev => ({
  //       ...prev,
  //       shippingAttention: prev.billingAttention,
  //       shippingAddressLine1: prev.billingAddressLine1,
  //       shippingAddressLine2: prev.billingAddressLine2,
  //       shippingCity: prev.billingCity,
  //       shippingState: prev.billingState,
  //       shippingPincode: prev.billingPincode,
  //     }));
  //   } else {
  //     setRegDetails(prev => ({
  //       ...prev,
  //       shippingAttention: '',
  //       shippingAddressLine1: '',
  //       shippingAddressLine2: '',
  //       shippingCity: '',
  //       shippingState: '',
  //       shippingPincode: '',
  //     }));
  //   }

  //   setSameAsBilling(checked);
  // };

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    values: typeof customerReg
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



  const validateSchema = Yup.object().shape({
    salutation: Yup.string().required('Salutation is required'),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    displayName: Yup.string().required('Display Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    workPhone: Yup.string().required('Work Phone is required'),
    mobileNo: Yup.string().required('Mobile Number is required'),
    pan: Yup.string().required('PAN Number is required'),
    gstNo: Yup.string().required('GST Number is required'),
    billingAttention: Yup.string().required('Attention is required'),
    billingAddressLine1: Yup.string().required('Address Line 1 is required'),
    billingState: Yup.string().required('State is required'),
    billingCity: Yup.string().required('City is required'),
    billingPincode: Yup.string().required('Pincode is required'),
    shippingAttention: Yup.string().required('Attention is required'),
    shippingAddressLine1: Yup.string().required('Address Line 1 is required'),
    shippingState: Yup.string().required('State is required'),
    shippingCity: Yup.string().required('City is required'),
    shippingPincode: Yup.string().required('Pincode is required'),
    placeOfSupply: Yup.string().required('Please Select Place of Supply'),
    contacts: Yup.array().of(
      Yup.object().shape({
        salutation: Yup.string().nullable(),
        firstName: Yup.string().nullable(),
        lastName: Yup.string().nullable(),
        email: Yup.string().email('Invalid email').nullable(),
        workPhone: Yup.string().nullable(),
        mobileNumber: Yup.string().nullable(),
      })
    ).notRequired(),
  });

  useEffect(() => {
    getCompanyDetails();
    if (id !== '') {
      getSingleCustomer();
    }
  }, []);

  const getSingleCustomer = async () => {
    try {
      const res = await getCustomerById({ id });
      if (res.success) {
        console.log('Customer Type : ', res.data.salutation)
        setType(res.data.customerType);
        setRegDetails({
          salutation: res.data.salutation,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          billingAddressLine1: res.data.billingAddressLine1,
          billingAddressLine2: res.data.billingAddressLine2,
          billingAttention: res.data.billingAttention,
          billingCity: res.data.billingCityId.toString(),
          billingPincode: res.data.billingPincode,
          billingState: res.data.billingStateId.toString(),
          companyId: res.data.companyId.toString(),
          companyName: res.data.companyName,
          displayName: res.data.displayName,
          email: res.data.email,
          mobileNo: res.data.mobileNumber,
          pan: res.data.pan,
          gstNo: res.data.gstNumber,
          shippingAddressLine1: res.data.shippingAddressLine1,
          shippingAddressLine2: res.data.shippingAddressLine2,
          shippingAttention: res.data.shippingAttention,
          shippingCity: res.data.shippingCityId.toString(),
          shippingPincode: res.data.shippingPincode,
          shippingState: res.data.shippingStateId.toString(),
          workPhone: res.data.workPhone,
          placeOfSupply: res.data.placeOfSupplyStateId,
          vid: res.data.vid,
          terms: res.data.terms
        })
        if (Array.isArray(res.data?.contactPersons)) {
          console.log("Contact Person Data : ", res.data.contactPersons.length);
          setContacts(res.data.contactPersons);
        } else {
          setContacts([]);
        }
      }
    }
    catch (error) {
      toast.error("Failed to fetch customer data");
    }
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
          ...customerReg,
          companyId: res.data.companyId.toString(),
          companyName: res.data.companyName,
        };

        setRegDetails(updatedDetails);

        // âœ… Now log immediately from updated object
        console.log("Company ID (updated) :", updatedDetails.companyId);
      } else {

      }
    } catch (err: any) {
      toast.error(err.toString())
    }
  };

  // async function onSumbit(values: typeof customerReg, { resetForm }: { resetForm: () => void }) {
  //   setIsLoading(true);
  //   try {
  //     const filteredContacts = contacts.filter((contact) => {
  //       return contact.firstName?.trim() || contact.lastName?.trim() ||  contact.email?.trim() || contact.workPhone?.trim();
  //     });

  //     let request: AddCustomerRequest = {
  //       billingAddressLine1: values.billingAddressLine1,
  //       billingAddressLine2: values.billingAddressLine2,
  //       billingAttention: values.billingAttention,
  //       billingCityId: parseInt(values.billingCity),
  //       billingPincode: values.billingPincode,
  //       billingStateId: parseInt(values.billingState),
  //       companyId: parseInt(values.companyId),
  //       contactPerson: filteredContacts,
  //       customerType: customerType,
  //       displayName: values.displayName,
  //       email: values.email,
  //       firstName: values.firstName,
  //       lastName: values.lastName,
  //       mobileNumber: values.mobileNo,
  //       pan: values.pan,
  //       salutaion: values.salutation,
  //       shippingAddressLine1: values.shippingAddressLine1,
  //       shippingAddressLine2: values.shippingAddressLine2,
  //       shippingAttention: values.shippingAttention,
  //       shippingCityId: parseInt(values.shippingCity),
  //       shippingPincode: values.shippingPincode,
  //       shippingStateId: parseInt(values.shippingState),
  //       workPhone: values.workPhone
  //     }

  //     console.log("Request ===========> ", request)
  //     let response = await addNewCustomer(request);
  //     setIsLoading(false);
  //     if (response.success) {
  //         toast.success(`ðŸŽ‰ ${response.message}`, {
  //             autoClose: 2000,
  //             onClose: () => { },
  //         });

  //         router.back()

  //         resetForm();
  //     }
  //     else {
  //         toast.error(`ðŸ¤” ${response.message}`, {
  //             autoClose: 2000,
  //         });
  //     }
  //   }
  //   catch {
  //     toast.error(`ðŸ¤” Something went wrong. Please try again!`, {
  //       autoClose: 2000,
  //     });
  //   }
  //   finally {
  //     setIsLoading(false);
  //   }
  // }

  async function onSubmit(values: typeof customerReg, { resetForm }: { resetForm: () => void }) {
    setIsLoading(true);
    try {
      const filteredContacts = contacts.filter((contact) => {
        return contact.firstName?.trim() || contact.lastName?.trim() || contact.email?.trim() || contact.workPhone?.trim();
      });

      let request: AddCustomerRequest = {
        billingAddressLine1: values.billingAddressLine1,
        billingAddressLine2: values.billingAddressLine2,
        billingAttention: values.billingAttention,
        billingCityId: parseInt(values.billingCity),
        billingPincode: values.billingPincode,
        billingStateId: parseInt(values.billingState),
        companyId: parseInt(customerReg.companyId),
        contactPersons: filteredContacts,
        customerType: customerType,
        displayName: values.displayName,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName, // âœ… fixed typo
        mobileNumber: values.mobileNo,
        pan: values.pan,
        gstNumber: values.gstNo,
        salutation: values.salutation,
        shippingAddressLine1: values.shippingAddressLine1,
        shippingAddressLine2: values.shippingAddressLine2,
        shippingAttention: values.shippingAttention,
        shippingCityId: parseInt(values.shippingCity),
        shippingPincode: values.shippingPincode,
        shippingStateId: parseInt(values.shippingState),
        workPhone: values.workPhone,
        placeOfSupplyStateId: values.placeOfSupply,
        vid: values.vid,
        terms: values.terms
      };

      console.log("Request ====>", request);
      const response = await addNewCustomer(request);

      if (response.success) {
        toast.success(`ðŸŽ‰ ${response.message}`, { autoClose: 2000 });
        router.back();
        resetForm();
      } else {
        toast.error(`ðŸ¤” ${response.message}`, { autoClose: 2000 });
      }
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(`ðŸ¤” Something went wrong. Please try again!`, { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  }

  async function onUpdate(values: typeof customerReg, { resetForm }: { resetForm: () => void }) {
    console.log("UPDATE ----------------")
    setIsLoading(true);
    try {
      const filteredContacts = contacts.filter((contact) => {
        return contact.firstName?.trim() || contact.lastName?.trim() || contact.email?.trim() || contact.workPhone?.trim();
      });

      let request: AddCustomerRequest = {
        billingAddressLine1: values.billingAddressLine1,
        billingAddressLine2: values.billingAddressLine2,
        billingAttention: values.billingAttention,
        billingCityId: parseInt(values.billingCity),
        billingPincode: values.billingPincode,
        billingStateId: parseInt(values.billingState),
        companyId: parseInt(customerReg.companyId),
        contactPersons: filteredContacts,
        customerType: customerType,
        displayName: values.displayName,
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName, // âœ… fixed typo
        mobileNumber: values.mobileNo,
        pan: values.pan,
        gstNumber: values.gstNo,
        salutation: values.salutation,
        shippingAddressLine1: values.shippingAddressLine1,
        shippingAddressLine2: values.shippingAddressLine2,
        shippingAttention: values.shippingAttention,
        shippingCityId: parseInt(values.shippingCity),
        shippingPincode: values.shippingPincode,
        shippingStateId: parseInt(values.shippingState),
        workPhone: values.workPhone,
        placeOfSupplyStateId: values.placeOfSupply,
        vid: values.vid,
        terms: values.terms
      };

      console.log("Request ====>", request);
      const response = await updateCustomer(request, id);

      if (response.success) {
        toast.success(`ðŸŽ‰ ${response.message}`, { autoClose: 2000 });
        router.back();
        resetForm();
      } else {
        toast.error(`ðŸ¤” ${response.message}`, { autoClose: 2000 });
      }
    } catch (error: any) {
      console.error("Submit Error:", error);
      toast.error(`ðŸ¤” Something went wrong. Please try again!`, { autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  }


  return (
      <div className='w-full flex flex-col items-center p-5'>
        <h1 className='text-3xl font-bold text-center text-black mb-10'>{id !== '' ? 'Update Customer' : 'Customer Registration'}</h1>

        <div className='w-[95%] border rounded-md bg-white p-5 text-black'>

          {/* Row 1: Customer Type */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-3'>
            <div className='col-span-1 md:col-span-1'>
              <div className="flex items-center gap-3">
                <div className="min-w-[120px]">
                  <CustomLabel title="Customer Type" />
                </div>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="customerType"
                    value="Business"
                    checked={customerType === 'Business'}
                    onChange={(e) => setType(e.target.value)}
                    className='accent-red-600'
                  />
                  Business
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="customerType"
                    value="Individual"
                    checked={customerType === 'Individual'}
                    onChange={(e) => setType(e.target.value)}
                    className='accent-red-600'
                  />
                  Individual
                </label>
              </div>
            </div>
          </div>
          <Formik
            initialValues={customerReg}
            validationSchema={validateSchema}
            onSubmit={id !== '' ? onUpdate : onSubmit}
            enableReinitialize
          >
            {({ setFieldValue, values, errors, touched, handleChange }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className='col-span-1'>
                    <CustomLabel title="Salutation" isCompulsory={true} />
                    <select className="w-full border bg-white focus:ring-1 focus:ring-red-300 rounded-md px-2 py-2 text-sm font-inter" name='salutation' onChange={(e) => setFieldValue('salutation', e.target.value)}>
                      <option value="">Select</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                    </select>
                    <ErrorMessage name="salutation" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className='col-span-1'>
                    <TextField label='First Name' name='firstName' value={values.firstName} onChange={handleChange} isCompulsory={true} className='text-sm'/>
                    <ErrorMessage name="firstName" component="div" className="text-red-600 text-sm mt-1" />
                  </div>

                  <div className='col-span-1'>
                    <TextField label='Last Name' name='lastName' value={values.lastName} onChange={handleChange} isCompulsory={true} />
                    <ErrorMessage name="lastName" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                  <div className='col-span-1 md:col-span-1'>
                    <TextField label='Company Name' name='companyName' value={customerReg.companyName} onChange={(e) => setRegDetails({ ...customerReg, companyName: e.target.value })} disabled={true} />
                  </div>
                  <div className='col-span-1 md:col-span-1'>
                    <TextField label='VID' name='vid' value={values.vid} onChange={handleChange} isCompulsory/>
                    <ErrorMessage name="vid" component="div" className="text-red-600 text-sm mt-1" />
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
                  <div className='col-span-1 md:col-span-1'>
                    <TextField label='GST No.' name='gstNo' value={values.gstNo} onChange={handleChange} isCompulsory={true} />
                    <ErrorMessage name="gstNo" component="div" className="text-red-600 text-sm mt-1" />
                  </div>
                  <div className="sm:col-span-1">
                    <CustomLabel title='Place of Supply' isCompulsory={true} />
                    <div className="relative w-full mt-1">
                      <StateDropDown
                        name='placeOfSupply'
                        labelVisible={true}
                        selectedStateId={values.placeOfSupply ? parseInt(values.placeOfSupply) : -1}
                        onValue={(stateId, selected) => {

                          let id = stateId.stateId.toString()
                          // setCityDetails({ stateId: id, cityName: values.cityName });
                          // handleChange(selected);
                          if (id === "-1") {
                            console.log("ID ------------", id)
                            setFieldValue('placeOfSupply', '');
                          } else {
                            setFieldValue('placeOfSupply', id);
                          }
                        }}
                      />
                      <ErrorMessage name="placeOfSupply" component="div" className="text-red-600 text-sm" />
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
                            <td className="px-3 py-2">
                              <select
                                value={contact.salutation}
                                onChange={(e) => updateContact(index, 'salutation', e.target.value)}
                                className="w-full border bg-white focus:outline-none focus:ring-1 focus:ring-red-300 border-gray-300 rounded px-2 py-1"
                              >
                                <option value="">Select</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Dr.">Dr.</option>
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <input type="text" className="w-full bg-white focus:ring-1 focus:ring-red-300 border border-gray-300 rounded px-2 py-1"
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
                              <input type="text" className="w-full border bg-white focus:ring-1 focus:ring-red-300 border-gray-300 rounded px-2 py-1"
                                value={contact.workPhone}
                                onChange={(e) => updateContact(index, 'workPhone', e.target.value)}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <input type="text" className="w-full border bg-white focus:ring-1 focus:ring-red-300 border-gray-300 rounded px-2 py-1"
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
                <h2 className="text-base mb-1 mt-3">Address</h2>
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

                  {/* Shipping Address */}
                  <h1 className='underline text-sm mt-4'>Shipping Address</h1>
                  <div className="mt-2 mb-3 flex items-center gap-2">
                    <input type="checkbox" id="sameAsBilling" checked={sameAsBilling} className="w-3 h-3 accent-red-600"  onChange={(e) => handleCheckboxChange(e, setFieldValue, values)} />
                    <label htmlFor="sameAsBilling" className="font-inter text-sm text-gray-700">Same as Billing Address</label>
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

                    <div className="sm:col-span-1">
                      <CustomLabel title='Pincode' isCompulsory={true} />
                      <div className="mt-1">
                        <input type="number" name='shippingPincode' autoComplete="given-name" value={values.shippingPincode} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:ring-1 focus:ring-red-300 bg-white focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="shippingPincode" component="div" className="text-red-600 text-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-1 mt-3">
                    <CustomLabel title='Terms' isCompulsory={true} />
                    <div className="mt-1">
                      <input type="multiline" name='terms' autoComplete="given-name" value={values.terms} onChange={handleChange} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 bg-white focus:ring-1 focus:ring-red-300 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                      <ErrorMessage name="shippingPincode" component="div" className="text-red-600 text-sm" />
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
                      onClick={() => router.replace('/sales/customer')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Form>)}
          </Formik>
          {/* <div className="relative border p-4 rounded mb-4" style={{ border: Colors.borderColor }}>
            <span className="absolute -top-2 left-3 bg-white px-2 text-sm font-medium" style={{ color: Colors.labelColor }}>
              Primary Contact
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className='col-span-1'>
                <CustomLabel title="Salutation" />
                <select className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Dr.">Dr.</option>
                </select>
              </div>

              <div className='col-span-1'>
                <TextField label='First Name' />
              </div>

              <div className='col-span-1'>
                <TextField label='Last Name' />
              </div>
            </div>
          </div> */}


        </div>
      </div>
   
  )
}
export default function CustomerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Customer />
    </Suspense>
  );
}
