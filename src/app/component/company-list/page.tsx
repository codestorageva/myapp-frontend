'use client'
import Layout from '@/app/component/layout'
import React, { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { TableColumn } from 'react-data-table-component'
import { IoSearchSharp } from 'react-icons/io5'
import CustomButton from '@/app/component/buttons/page'
import { FaPlus } from 'react-icons/fa'
const DataTable = dynamic(() =>
    import('react-data-table-component').then((mod) => mod.default as React.ComponentType<any>),
    { ssr: false }
)

export interface DataRow {
    no: number;
    companyName: string;
    ownerName: string;
    address: string;
    panNo: string;
    gstNo: string;
}

const CompanyList = () => {

    const [searchData, setSearchTableData] = useState('')
    const headerColumn: TableColumn<DataRow>[] = [
        { name: 'No', sortable: true, selector: row => row.no },
        { name: 'Company Name', sortable: true, selector: row => row.companyName },
        { name: 'Owner Name', sortable: true, selector: row => row.ownerName },
        { name: 'Address', sortable: true, selector: row => row.address },
        { name: 'Pan No', sortable: true, selector: row => row.panNo },
        { name: 'GST No', sortable: true, selector: row => row.gstNo }
    ]

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "rgba(117, 117, 117, 0.4)",
                color: "black",
                fontSize: "14px",
                textAlign: "center" as "center",
            },
        },
    };

    const filteredData: DataRow[] = [
        {
            no: 1,
            companyName: 'Vaistra Technologies',
            ownerName: 'Jayminbhai Motivaras',
            address: 'Kuber Kastbhanjan, near railway station, porbandar',
            panNo: '123456789',
            gstNo: '123456'
        },

    ];

    const filteredRows = filteredData.filter((row) =>
        Object.values(row).some((value) =>
            value.toString().toLowerCase().includes(searchData.toLowerCase())
        )
    );

    return (
        <Layout>
            <div className="relative w-full h-full">
                {/* Background Image Layer */}
                <div className="fixed inset-0 -z-10">
                    {/* <Image
                        src="/assets/images/bg.png"
                        alt="Background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40" /> */}
                </div>
                <div className='relative flex flex-col w-full h-full'>
                    <h1 className="text-3xl font-bold text-center text-black mb-10 mt-10">Company Details</h1>
                    <div className="flex items-center justify-between space-x-3">
                        <div className='py-3 relative'>
                            <input type="text" placeholder="Search Here ...!" className="px-2 border py-1 rounded-lg text-sm placeholder:text-sm bg-white" style={{ borderRadius: '0.3rem' }} onChange={(e) => setSearchTableData(e.target.value)} />
                            <IoSearchSharp className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        </div>
                        <div className='flex space-x-3 mx-3'>

                            {/* <button
                                className="next-btn bg-blue-500 hover:bg-blue-400 text-white px-3 py-2 rounded flex items-center space-x-2 transition duration-200"
                                onClick={() => router.push(ROUTES.state_add)}
                            >
                                <FaPlus className="text-white" />
                                <span>Add</span>
                            </button> */}
                            <CustomButton
                                name="Add"
                                className="next-btn bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded flex items-center  transition duration-200 font-inter"
                                onClick={() => { }}
                                permission_name=''
                            />
                            {/* <button
                                className="bg-gradient-to-t from-red-500 to-red-400 px-3 py-2 rounded flex items-center space-x-1 transition duration-200 text-white hover:bg-gradient-to-t hover:from-red-400 hover:to-red-500" onClick={() => router.push(ROUTES.restore_state)}
                            >
                                <FaTrashRestore className="text-white" />
                                <span>Restore</span>
                            </button> */}
                            <CustomButton
                                name="Restore"
                                className="bg-gradient-to-t from-red-500 to-red-400 px-3 py-2 rounded flex items-center space-x-1 transition duration-200 text-white hover:bg-gradient-to-t hover:from-red-400 hover:to-red-500 border-0 font-inter"
                                onClick={() =>{}}
                                permission_name=''
                            />
                        </div>
                    </div>
                    <div>
                        <DataTable
                            columns={headerColumn}
                            data={filteredRows}
                            fixedHeader
                            customStyles={customStyles}
                            pagination
                            highlightOnHover
                            noDataComponent="No records found!"
                            className='font-inter rounded'
                        />
                    </div>
                </div>
            </div>
        </Layout>

    )
}

export default CompanyList