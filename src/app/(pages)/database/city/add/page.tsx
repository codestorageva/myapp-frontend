'use client';
import { addCity, AddCityParams, getCityById, updateSCity } from '@/app/(pages)/common/city_dropdown/city_controller';
import StateDropDown from '@/app/(pages)/common/state_dropdown/page';
import TextField from '@/app/component/inputfield';
import CustomLabel from '@/app/component/label';
import Layout from '@/app/component/layout';
import Loader from '@/app/component/Loader/page';
import { ErrorMessage, Form, Formik } from 'formik';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from "react";
import { toast } from 'react-toastify';
import * as Yup from "yup";

const CityAddUpdate = () => {

    const router = useRouter();
    const [cityDetails, setCityDetails] = useState<AddCityParams>({ stateId: '', cityName: '' });
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const [isModalOpen, setIsModalOpen] = useState(false);

    const citySchema = Yup.object().shape({
        stateId: Yup.string().required('Select State'),
        cityName: Yup.string().min(2, 'City name is too short!').required('City Name is required')
    });

    useEffect(() => {
        if (id !== '') {
            getSingleCity();
        }
    }, [])

    const getSingleCity = async () => {
        try {

            const res = await getCityById({ id });
            if (res.success) {
                setCityDetails({
                    stateId: res.data.stateId.toString(),
                    cityName: res.data.cityName
                });
            } else {
                toast.error("City not found");
            }
        } catch (error) {
            toast.error("Failed to fetch city data");
        } finally {

        }
    }

    const handleClose = () => {
        setIsModalOpen(false);
    }

    async function onSumbit(values: AddCityParams, { resetForm }: { resetForm: () => void }) {
        setIsLoading(true);
        try {
            let response = await addCity(values);
            setIsLoading(false);
            if (response.success) {
                toast.success(`ðŸŽ‰ ${response.message}`, {
                    autoClose: 2000,
                    onClose: () => { },
                });

                //router.back()

                resetForm();
            }
            else {
                toast.error(`ðŸ¤” ${response.message}`, {
                    autoClose: 2000,
                });
            }
        }
        catch {
            toast.error(`ðŸ¤” Something went wrong. Please try again!`, {
                autoClose: 2000,
            });
        }
        finally {
            setIsLoading(false);
        }
    }

    async function onUpdate(values: AddCityParams) {
        setIsLoading(true);
        try {
            let response = await updateSCity(values, id);
            if (response.success) {
                toast.success(`ðŸŽ‰ ${response.message}`, {
                    autoClose: 2000,
                    onClose: () => { },
                });

                router.back()

            }
            else {
                toast.error(`ðŸ¤” ${response.message}`, {
                    autoClose: 2000,
                });
            }
        }
        catch {
            toast.error(`ðŸ¤” Something went wrong. Please try again!`, {
                autoClose: 2000,
            });
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center  p-5'>
            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full bg-white/50 flex items-center justify-center z-50">
                    <Loader isInside={true} />
                </div>
            )}
            <h1 className="text-3xl font-bold text-center text-black mb-10 mt-10">{id !== '' ? 'Edit' : 'Add New'} City</h1>
            <div className='min-w-[25%] border rounded-md bg-white p-5 mb-5 space-y-4 text-black'>

                <Formik
                    initialValues={cityDetails}
                    validationSchema={citySchema}
                    onSubmit={id !== '' ? onUpdate : onSumbit}
                    enableReinitialize
                >
                    {({ handleChange, values, setFieldValue }) => (
                        <Form className="space-y-3">
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
                                <CustomLabel title='State' isCompulsory />
                                <StateDropDown
                                    name='stateId'
                                    labelVisible={true}
                                    selectedStateId={parseInt(values.stateId ?? -1)}
                                    onValue={(stateId, selected) => {
                                        let id = stateId.stateId.toString()
                                        // setCityDetails({ stateId: id, cityName: values.cityName });
                                        // handleChange(selected);
                                        setFieldValue('stateId', id);
                                    }}
                                />
                                <ErrorMessage name="stateId" component="div" className="text-red-500 text-sm" />
                                <br />
                                <TextField label='City Name' value={values.cityName} onChange={handleChange} name='cityName' isCompulsory />
                                <ErrorMessage name="cityName" component="div" className="text-red-500 text-sm" />
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
    )
}
export default function CityAddUpdatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CityAddUpdate />
    </Suspense>
  );
}
