'use client';
import { addState, AddStateParams, getStateById, updateState } from '@/app/(pages)/common/state_dropdown/state_controller';
import CustomLabel from '@/app/component/label';
import Layout from '@/app/component/layout';
import Loader from '@/app/component/Loader/page';
import { ErrorMessage, Field, Formik } from 'formik';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Form } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import TextField from '@/app/component/inputfield';

const AddState = () => {

    const router = useRouter();
    const [stateDetails, setStateName] = useState<AddStateParams>({ stateName: '' });
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const stateSchema = Yup.object().shape({
        stateName: Yup.string()
            .min(2, "State name is too short!")
            .max(50, "State name is too long!")
            .required("State name is required"),
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function onSumbit(values: AddStateParams, { resetForm }: { resetForm: () => void }) {
        setIsLoading(true);
      try {
            let response = await addState(values);
            setIsLoading(false);
            if (response.success) {
                toast.success(`🎉 ${response.message}`, {
                    autoClose: 2000,
                    onClose: () => { },
                });

                router.back()

                resetForm();
            }
            else {
                toast.error(`🤔 ${response.message}`, {
                    autoClose: 2000,
                });
            }
       }
        catch {
            toast.error(`🤔 Something went wrong. Please try again!`, {
                autoClose: 2000,
            });
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    async function onUpdate(values: AddStateParams) {
        setIsLoading(true);
        try {
            let response = await updateState(values, id);
            if (response.success) {
                toast.success(`🎉 ${response.message}`, {
                    autoClose: 2000,
                    onClose: () => { },
                });

                router.back()

            }
            else {
                toast.error(`🤔 ${response.message}`, {
                    autoClose: 2000,
                });
            }
        }
        catch {
            toast.error(`🤔 Something went wrong. Please try again!`, {
                autoClose: 2000,
            });
        }
        finally {
            setIsLoading(false)
        }
    }

    const getSingleState = async () => {
        let res = await getStateById(id);
        if (res.success) {
            setStateName({ stateName: res.data.stateName })
        }
    }

    useEffect(() => {
        if (id !== '') {
            getSingleState();
        }

    }, [id])

    return (
        <Layout>
            <div className='w-full flex flex-col items-center'>
                {isLoading && (
                    <div className="fixed top-0 left-0 w-full h-full bg-white/50 flex items-center justify-center z-50">
                        <Loader isInside={true} />
                    </div>
                )}
                <h1 className="text-3xl font-bold text-center text-black mb-10 mt-10">{id !== '' ? 'Edit' : 'Add New'} State</h1>
                <div className='min-w-[25%] border rounded-md bg-white p-5 mb-5 space-y-4'>

                    <Formik
                        initialValues={stateDetails}
                        validationSchema={stateSchema}
                        onSubmit={id !== '' ? onUpdate : onSumbit}
                        enableReinitialize
                    >
                        {({ handleChange, values }) => (
                            <Form className="space-y-4">
                                <div className=" items-center gap-3">
                                    {/* <div className="min-w-[100px]">
                                        <CustomLabel title="State Name" />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            name="stateName"
                                            type="text"
                                            value={values.stateName}
                                            onChange={handleChange}
                                            className="w-full rounded-md border border-gray-300 py-1 px-2 text-gray-900 focus:outline-none focus:border-blue-500 sm:text-sm"
                                        />
                                        <ErrorMessage name="stateName" component="div" className="text-red-500 text-sm" />
                                    </div> */}
                                    <TextField label='State Name' value={values.stateName} onChange={handleChange} name='stateName' />
                                    <ErrorMessage name="stateName" component="div" className="text-red-500 text-sm" />

                                </div>

                                <div className="w-full flex items-center justify-center gap-5 pt-4">
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
                                        onClick={() => router.back()}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Layout>
    )
}

export default AddState