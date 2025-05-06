import CustomLabel from '@/app/component/label'
import Colors from '@/app/utils/colors'
import React, { FC } from 'react'
import { ErrorMessage } from 'formik'

// const PersonalDetails: FC<any> = ({ regDetails, setRegDetails, industries }) => {
//     return (
//         <div className='w-full mb-3'>
//             <div className='mt-5 grid grid-cols-3 gap-x-4 gap-y-3'>
//                 <div className="sm:col-span-1">
//                     <CustomLabel title='Company Name' />
//                     <div className="mt-1">
//                         <input type="text" name="companyName" required autoComplete="given-name" value={regDetails.companyName} onChange={(e) => setRegDetails({ ...regDetails, companyName: e.target.value })}  className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
//                     </div>
//                 </div>
//                 <div className="sm:col-span-1">
//                     <CustomLabel title='Owner Name' />
//                     <div className="mt-1">
//                         <input type="text" required autoComplete="given-name" value={regDetails.ownerName} onChange={(e) => setRegDetails({ ...regDetails, ownerName: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
//                     </div>
//                 </div>
//                 <div className="sm:col-span-1">
//                     <CustomLabel title='Company Logo' />
//                     <div className="mt-1">
//                         <input type="file" required  autoComplete="given-name" value={regDetails.logo} onChange={(e) => setRegDetails({ ...regDetails, logo: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
//                     </div>
//                 </div>
//                 <div className="sm:col-span-1">
//                     <CustomLabel title='Pan Number' />
//                     <div className="mt-1">
//                         <input type="number" required  autoComplete="given-name" value={regDetails.panNo} onChange={(e) => setRegDetails({ ...regDetails, panNo: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
//                     </div>
//                 </div>
//                 <div className="sm:col-span-1">
//                     <CustomLabel title='GST Number' />
//                     <div className="mt-1">
//                         <input type="number" required  autoComplete="given-name" value={regDetails.gstNo} onChange={(e) => setRegDetails({ ...regDetails, gstNo: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
//                     </div>
//                 </div>
//                 <div className='sm:col-span-1'>
//                     <CustomLabel title='Industry'/>
//                     <div className="relative w-full mt-1">
//                         <select
//                             value={regDetails.industry}
//                             onChange={(e) => {
//                                 setRegDetails({ ...regDetails, industry: e.target.value })
//                             }}
//                             className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
//                         >
//                             <option value="">Select Industry</option>
//                             {industries.map((industry: string, index: number) => (
//                                 <option key={index} value={industry}>
//                                     {industry}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//                 {/* <div className='sm:col-span-3'>
//                     <CustomLabel title='Service Description'/>
//                     <input type="text" required  autoComplete="given-name" value={regDetails.companyName} onChange={(e) => setRegDetails({ ...regDetails, companyName: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />

//                 </div> */}
//             </div>
//         </div>
//     )
// }

// export default PersonalDetails

const PersonalDetails: FC<any> = ({ values, handleChange, handleBlur, industries}) => {
    return (
        <div className='w-full mb-3'>
            <div className='mt-5 grid grid-cols-3 gap-x-4 gap-y-3'>
                <div className="sm:col-span-1">
                    <CustomLabel title='Company Name' />
                    <div className="mt-1">
                        <input type="text" name="companyName" required autoComplete="given-name" value={values.companyName} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="companyName" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Owner Name' />
                    <div className="mt-1">
                        <input type="text" required name='ownerName' autoComplete="given-name" value={values.ownerName}  onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="ownerName" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Company Logo' />
                    <div className="mt-1">
                        <input type="file" required name='logo' autoComplete="given-name" value={values.logo} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="logo" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='Pan Number' />
                    <div className="mt-1">
                        <input type="text" required name='panNo' autoComplete="given-name" value={values.panNo} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="panNo" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className="sm:col-span-1">
                    <CustomLabel title='GST Number' />
                    <div className="mt-1">
                        <input type="text" required  name="gstNo" autoComplete="given-name" value={values.gstNo} onChange={handleChange} onBlur={handleBlur} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />
                        <ErrorMessage name="gstNo" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                <div className='sm:col-span-1'>
                    <CustomLabel title='Industry'/>
                    <div className="relative w-full mt-1">
                        <select
                            value={values.industry}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="industry"
                            className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                        >
                            <option value="">Select Industry</option>
                            {industries.map((industry: string, index: number) => (
                                <option key={index} value={industry}>
                                    {industry}
                                </option>
                            ))}
                        </select>
                        <ErrorMessage name="industry" component="div" className="text-red-600 text-sm" />
                    </div>
                </div>
                {/* <div className='sm:col-span-3'>
                    <CustomLabel title='Service Description'/>
                    <input type="text" required  autoComplete="given-name" value={regDetails.companyName} onChange={(e) => setRegDetails({ ...regDetails, companyName: e.target.value })} className="block w-full font-inter rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6" />

                </div> */}
            </div>
        </div>
    )
}

export default PersonalDetails
