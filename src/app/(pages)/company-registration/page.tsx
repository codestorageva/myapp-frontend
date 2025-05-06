'use client'
import React, { useEffect, useState } from 'react'
// import PersonalDetails from './component/personal_details';
import Image from 'next/image'
import BankDetails from './component/bank_details';
import Layout from '@/app/component/layout';
import AddressDetails from './component/address';
import { useRouter, useSearchParams } from 'next/navigation';
import * as Yup from 'yup';
import { Formik, Form } from 'formik'
import PersonalDetails from './component/personal_details';
import HeaderComponent from '@/app/component/Header-main';
import { companyReg, CompanyRegRequest, companyUpdate } from './registration';
import Loader from '@/app/component/Loader/page';
import { toast } from 'react-toastify';
import { getCompanyById } from '../dashboard-page/dashboard';

const CompanyRegistration = () => {
    const router = useRouter()
    const [regDetails, setRegDetails] = useState({ companyName: '', ownerName: '', logo: null, addressLine1: '', addressLine2: '', addressLine3: '', state1: '', city1: '', pincode1: '', shippingAddressLine1: '', shippingAddressLine2: '', shippingAddressLine3: '', shippingState: '', shippingCity: '', shippingPincode: '', panNo: '', gstNo: '', serviceDes: '', accountHolderName: '', bankName: '', branchName: '', accountNo: '', IFSC: '', bankAddress: '', industry: '' })
    const steps = [
        { id: 1, label: "Your Profile", active: true },
        { id: 2, label: "Auto Generate VID", active: false },
    ];
    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const [companyLogo, setCompanyLogo] = useState('')
    const [activeStep, setActiveStep] = useState(1);
    const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh']
    const cities = ['Ahmedabad', 'Surat', 'Baroda', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Porbandar', 'Morbi', 'Nadiad', 'Bharuch', 'Vapi', 'Ankleshwar', 'Patan', 'Mehsana', 'Bhuj', 'Palanpur', 'Veraval', 'Surendranagar']
    const industries = ['Agency or sales house', 'Agriculture', 'Art and design', 'Automative', 'Construction', 'Consulting', 'Consumer packaged goods', 'Education', 'Engeering', 'Entertainment', 'Financial services', 'Foods services', 'Gaming', 'Government', 'Health care', 'Interior design', 'Internal', 'Legal', 'Manufacturing', 'Marketing', 'Mining and web media', 'Real State', 'Retail', 'Services', 'Technology', 'Telecommunications', 'Travel/Hospitality', 'Web designing', 'Web development', 'Writers']
    const validationSchema = Yup.object({
        companyName: Yup.string().required('Organization Name is required'),
        ownerName: Yup.string().required('Owner Name is required'),
        panNo: Yup.string().required('Pan Number is required'),
        gstNo: Yup.string().required('GST Numner is required'),
        industry: Yup.string().required('Industry is required'),
        addressLine1: Yup.string().required('Address Line 1 is required'),
        state1: Yup.string().required('State is required'),
        city1: Yup.string().required('City is required'),
        pincode1: Yup.string().required('Pincode is required'),
        shippingAddressLine1: Yup.string().required('Address Line 1 is required'),
        shippingState: Yup.string().required('State is required'),
        shippingCity: Yup.string().required('City is required'),
        shippingPincode: Yup.string().required('Pincode is required'),
        accountHolderName: Yup.string().required('Account Holder Name is required'),
        bankName: Yup.string().required('Bank Name is required'),
        branchName: Yup.string().required('Branch Name is required'),
        accountNo: Yup.string().required('Account Number is required'),
        IFSC: Yup.string().required('IFSC Code is required'),
        bankAddress: Yup.string().required('Bank Address is required'),
        logo: Yup.mixed()
            .nullable() // ✅ allow null when editing
            .when([], {
                is: () => id === '', // ✅ use outer id variable directly
                then: (schema) =>
                    schema
                        .required('Please Upload Logo')
                        .test('fileType', 'Unsupported file format', (value) => {
                            return (
                                value instanceof File &&
                                ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
                            );
                        }),
                otherwise: (schema) => schema.notRequired(),
            }),

    })
    const [isLoading, setIsLoading] = useState(false)

    async function onSubmit(values: typeof regDetails) {
        // window.history.replaceState(null, '', '/')
        console.log('State ID : ', values.state1, "  City ID : ", values.shippingState)
        // router.back()
        setIsLoading(true)
        if (!values.logo) {
            alert('Please upload a logo before submitting');
            return;
        }

        try {
            const req: CompanyRegRequest = {
                accHolderName: values.accountHolderName,
                accountNumber: values.accountNo,
                bankAddress: values.bankAddress,
                bankName: values.bankName,
                billingAddress1: values.addressLine1,
                billingAddress2: values.addressLine2,
                billingAddress3: values.addressLine3,
                billingCityId: values.city1,
                billingPincode: values.pincode1,
                billingStateId: values.state1,
                branch: values.branchName,
                companyName: values.companyName,
                gstNumber: values.gstNo,
                ifscCode: values.IFSC,
                industry: values.industry,
                ownerName: values.ownerName,
                panNumber: values.panNo,
                serviceDescription: values.serviceDes,
                shippingAddress1: values.shippingAddressLine1,
                shippingAddress2: values.shippingAddressLine2,
                shippingAddress3: values.shippingAddressLine3,
                shippingCityId: values.shippingCity,
                shippingPincode: values.shippingPincode,
                shippingStateId: values.shippingState,
            }
            let res = await companyReg(values.logo, req);
            setIsLoading(false);
            if (res.success) {
                toast.success(`🎉 ${res.message}`, {
                    autoClose: 2000,
                    onClose: () => { },
                });
                router.back();
            }
            else {
                alert(res.message);
            }
            // const res = await companyReg(values);
        }
        catch (e) {
            alert('Registration failed. Please try again!')
        }
        finally {
            setIsLoading(false)
        }
    }

    async function onUpdate(values: typeof regDetails) {
        // window.history.replaceState(null, '', '/')
        console.log('State ID : ', values.state1, "  City ID : ", values.shippingState)
        // router.back()
        setIsLoading(true)
        // if (!values.logo) {
        //     alert('Please upload a logo before submitting');
        //     return;
        // }

        try {
            const req: CompanyRegRequest = {
                accHolderName: values.accountHolderName,
                accountNumber: values.accountNo,
                bankAddress: values.bankAddress,
                bankName: values.bankName,
                billingAddress1: values.addressLine1,
                billingAddress2: values.addressLine2,
                billingAddress3: values.addressLine3,
                billingCityId: values.city1,
                billingPincode: values.pincode1,
                billingStateId: values.state1,
                branch: values.branchName,
                companyName: values.companyName,
                gstNumber: values.gstNo,
                ifscCode: values.IFSC,
                industry: values.industry,
                ownerName: values.ownerName,
                panNumber: values.panNo,
                serviceDescription: values.serviceDes,
                shippingAddress1: values.shippingAddressLine1,
                shippingAddress2: values.shippingAddressLine2,
                shippingAddress3: values.shippingAddressLine3,
                shippingCityId: values.shippingCity,
                shippingPincode: values.shippingPincode,
                shippingStateId: values.shippingState,
            }
            let res = await companyUpdate(values.logo ?? null, req, id);
            setIsLoading(false);
            if (res.success) {
                toast.success(`🎉 ${res.message}`, {
                    autoClose: 2000,
                    onClose: () => { },
                });
                router.back();
            }
            else {
                alert(res.message);
            }
            // const res = await companyReg(values);
        }
        catch (e) {
            alert('Update failed. Please try again!')
        }
        finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        if (id != '') {
            getCompanyDetails();
        }
    }, [])


    const getCompanyDetails = async () => {
        try {
            const res = await getCompanyById(id);
            if (res.success) {
                const companyDetails = {
                    ...regDetails,
                    companyName: res.data.companyName,
                    ownerName: res.data.ownerName,
                    addressLine1: res.data.billingAddress1,
                    addressLine2: res.data.billingAddress2,
                    addressLine3: res.data.billingAddress3,
                    state1: res.data.billingStateId,
                    city1: res.data.billingCityId,
                    pincode1: res.data.billingPincode,
                    shippingAddressLine1: res.data.shippingAddress1,
                    shippingAddressLine2: res.data.shippingAddress2,
                    shippingAddressLine3: res.data.shippingAddress3,
                    shippingState: res.data.shippingStateId,
                    shippingCity: res.data.shippingCityId,
                    shippingPincode: res.data.shippingPincode,
                    panNo: res.data.panNumber,
                    gstNo: res.data.gstNumber,
                    accountHolderName: res.data.bankDetails[0].accHolderName,
                    bankName: res.data.bankDetails[0].bankName,
                    branchName: res.data.bankDetails[0].bankName,
                    accountNo: res.data.bankDetails[0].accountNumber,
                    IFSC: res.data.bankDetails[0].ifscCode,
                    bankAddress: res.data.bankDetails[0].bankAddress,
                    industry: res.data.industry,
                };
                setRegDetails(companyDetails);
                setCompanyLogo(res.data.logo);
            }
            else {
                toast.error('Company Not Found!');
            }
        }
        catch (err: any) {
            toast.error(err.toString());
        }
    }

    return (
        // <div className='flex flex-col justify-center items-center bg-gradient-to-b from-[#0C86EC] to-[#03508C] h-screen p-0 m-0'>
        //     <h1 className="text-2xl font-bold text-center text-white mb-10">Sign Up</h1>
        //     <div className="bg-white rounded-lg shadow-2xl w-full sm:w-3/4 lg:w-2/3 max-w-full px-4 py-6">
        //         <div className="flex w-[90%] mx-auto rounded-full overflow-hidden">
        //             {steps.map((step, index) => (
        //                 <div
        //                     key={step.id}
        //                     className={`flex-1 flex items-center justify-center transition-all duration-200 ${step.id <= activeStep
        //                         ? "text-blue-600 font-medium"
        //                         : "text-gray-400"
        //                         }`}
        //                 >
        //                     <span className="flex items-center space-x-2">
        //                         <span
        //                             className={`flex items-center justify-center w-6 h-6 border-2 rounded-full text-sm transition-all ${step.id < activeStep
        //                                 ? "border-blue-600 text-blue-600 bg-white"
        //                                 : step.id === activeStep
        //                                     ? "border-blue-600 text-white bg-blue-600"
        //                                     : "border-gray-300 text-gray-400 bg-white"
        //                                 }`}
        //                         >
        //                             {step.id}
        //                         </span>
        //                         <span>{step.label}</span>
        //                     </span>
        //                 </div>
        //             ))}
        //         </div>
        //         <PersonalDetails regDetails={regDetails} setRegDetails={setRegDetails} states={states} cities={cities}></PersonalDetails>
        //         <div className="mt-10 w-full flex items-center justify-center gap-5">
        //             <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium font-inter">
        //                 Submit
        //             </button>
        //             <button type="submit" className="w-full md:w-auto border border-[#03508C] text-[#03508C] hover:bg-green-50 px-6 py-2 rounded-lg font-medium font-inter transition-colors">
        //                 Clear
        //             </button>
        //         </div>
        //     </div>
        // </div>
        // <Layout>
        <div className="relative w-full h-full">
            <div className="fixed inset-0 -z-10">
                <Image
                    src="/assets/images/bg.png"
                    alt="Background"
                    fill
                    className="!object-cover !object-center"
                />
                <div className="absolute inset-0 bg-black/40 z-0" />
            </div>
            {isLoading && <Loader />}
            <Layout showSidebar={false}>
                <div className='relative flex flex-col w-full h-full'>
                    <div className='w-full flex flex-col h-screen items-center'>
                        <h1 className="text-3xl font-bold text-center text-white mb-10">{id !== '' ? 'Update Organization' : 'Organization Registration'}</h1>
                        <div className="w-full flex justify-center">
                            <Formik
                                initialValues={regDetails}
                                validationSchema={validationSchema}
                                onSubmit={id !== '' ? onUpdate : onSubmit}
                                enableReinitialize
                            >
                                {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                                    <Form className="w-[90%]">
                                        <div className='border rounded-md items-start bg-white p-5 mb-5'>
                                            <h1 className="text-2xl font-bold text-cente mb-3">Personal Details</h1>
                                            <PersonalDetails values={values} handleChange={handleChange} handleBlur={handleBlur} industries={industries} setFieldValue={setFieldValue} companyLogo={companyLogo} />
                                        </div>
                                        <div className='border rounded-md items-start bg-white p-5 mb-5'>
                                            <h1 className="text-2xl font-bold text-cente mb-3">Address Details</h1>
                                            <AddressDetails values={values} handleChange={handleChange} states={states} cities={cities} setFieldValue={setFieldValue} />
                                        </div>
                                        <div className=' border rounded-md items-start bg-white p-5'>
                                            <h1 className="text-2xl font-bold text-cente mb-3">Bank Details</h1>
                                            <BankDetails values={values} handleChange={handleChange} />
                                        </div>
                                        <div className="mt-10 w-full flex items-center justify-center gap-5 pb-8">
                                            <button
                                                type="submit"
                                                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium font-inter shadow-lg"
                                            >
                                                {id !== '' ? 'Update' : 'Submit'}
                                            </button>
                                            <button type="reset" className="w-full md:w-auto bg-[#03508C] text-white hover:bg-[#0874CB] px-6 py-2 rounded-lg font-medium font-inter transition-colors shadow-lg" onClick={() => router.back()}>
                                                Cancel
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </Layout >
        </div >
        // </Layout>
        // <div className='flex flex-col items-center h-screen p-0 m-0'>
        //      <h1 className="text-2xl font-bold text-center text-black mb-10 mt-5">Sign Up</h1>
        //      <div className='w-[95%] border rounded-md items-start bg-white p-5 mb-5'>
        //         <h1 className="text-2xl font-bold text-cente mb-10">Personal Details</h1>
        //         <PersonalDetails regDetails={regDetails} setRegDetails={setRegDetails} states={states} cities={cities}/>
        //      </div>
        //      <div className='w-[95%] border rounded-md items-start bg-white p-5'>
        //         <h1 className="text-2xl font-bold text-cente mb-10">Bank Details</h1>
        //         <BankDetails regDetails={regDetails} setRegDetails={setRegDetails} states={states} cities={cities}/>
        //      </div>
        // </div>
    )
}

export default CompanyRegistration