'use client'
import { useState } from 'react'
import CustomLabel from '@/app/component/label'
import Layout from '@/app/component/layout'

const AddNewItem = () => {
    const [itemType, setItemType] = useState('Goods')
    const [item, setItem] = useState({ name: '', hsnCode: '', unit: '', taxPref: '' })
    const unitOptions = ['gm', 'kg', 'mg', 'ltr', 'ml', 'piece', 'pack', 'box', 'dozen', 'meter', 'cm', 'inch'];
    const taxPreference = ['Taxable', 'Non-Taxable', 'Out of Scope', 'Non-GST Supply']
    return (
        <Layout>
            <div className='w-full flex flex-col items-center'>
                <h1 className="text-3xl font-bold text-center text-black mb-10 mt-10">Add New Item</h1>

                <div className='min-w-[25%] border rounded-md bg-white p-5 mb-5 space-y-4'>

                    {/* Item Type */}
                    <div className="flex items-center gap-3">
                        <div className="min-w-[100px]">
                            <CustomLabel title="Type" />
                        </div>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="itemType"
                                value="Goods"
                                checked={itemType === 'Goods'}
                                onChange={(e) => setItemType(e.target.value)}
                            />
                            Goods
                        </label>
                        <label className="flex items-center gap-1">
                            <input
                                type="radio"
                                name="itemType"
                                value="Service"
                                checked={itemType === 'Service'}
                                onChange={(e) => setItemType(e.target.value)}
                            />
                            Service
                        </label>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="min-w-[100px]">
                            <CustomLabel title="Item Name" />
                        </div>
                        <input
                            type='text'
                            value={item.name}
                            onChange={(e) => setItem({ ...item, name: e.target.value })}
                            className="flex-1 rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 placeholder:text-gray-400 sm:text-sm font-inter"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="min-w-[100px]">
                            <CustomLabel title={itemType === 'Goods' ? 'HSN Code' : 'SAC Code'} />
                        </div>
                        <input
                            type='text'
                            value={item.hsnCode}
                            onChange={(e) => setItem({ ...item, hsnCode: e.target.value })}
                            className="flex-1 rounded-md border focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-blue-500 placeholder:text-gray-400 sm:text-sm font-inter"
                        />
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className="min-w-[100px]">
                            <CustomLabel title='Unit' />
                        </div>
                        <select
                            value={item.unit}
                            onChange={(e) => {
                                setItem({ ...item, unit: e.target.value })
                            }}
                            className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                        >
                            <option value="">Select Unit</option>
                            {unitOptions.map((unit: string, index: number) => (
                                <option key={index} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='flex items-center gap-3'>
                        <div className="min-w-[100px]">
                            <CustomLabel title='Tax Preference' />
                        </div>
                        <select
                            value={item.taxPref}
                            onChange={(e) => {
                                setItem({ ...item, taxPref: e.target.value })
                            }}
                            className="block w-full rounded-md border focus:outline-none border-gray-300 py-2 px-2 text-gray-900 focus:border-blue-500 focus:border-[2px] placeholder:text-gray-400 sm:text-sm sm:leading-6 font-inter"
                        >
                            <option value="">Select Tax Preference</option>
                            {taxPreference.map((tax: string, index: number) => (
                                <option key={index} value={tax}>
                                    {tax}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="w-full flex items-center justify-center gap-5 pb-4 pt-4">
                            <button type="submit" className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium font-inter shadow-lg">
                                Submit
                            </button>
                            <button type="submit" className="w-full md:w-auto  bg-[#03508C] text-white hover:bg-[#0874CB] px-6 py-2 rounded-lg font-medium font-inter transition-colors shadow-lg">
                                Cancel
                            </button>
                        </div>
                </div>
            </div>
        </Layout>
    )
}

export default AddNewItem
