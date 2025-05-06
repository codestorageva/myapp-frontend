'use client'
import CustomButton from '@/app/component/buttons/page'
import Layout from '@/app/component/layout'
import React, { useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { IoSearchSharp } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

export interface DataRow {
    no: number;
    type: string;
    name: string;
    hsn: string;
    unit: string;
    tax: string;
}

const ItemList = () => {

    const router = useRouter()

    const [searchData, setSearchTableData] = useState('')
        const headerColumn: TableColumn<DataRow>[] = [
            { name: 'No', sortable: true, selector: row => row.no, width: '05%'},
            { name: 'Name', sortable: true, selector: row => row.name },
            { name: 'Type', sortable: true, selector: row => row.type, width:'10%'},
            { name: 'HSN/SAC Code', sortable: true, selector: row => row.hsn },
            { name: 'Unit', sortable: true, selector: row => row.unit },
            { name: 'Tax Preference', sortable: true, selector: row => row.tax }
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
                name: 'XYZ',
                type: 'Goods',
                hsn: '123456',
                unit: 'Kuber Kastbhanjan, near railway station, porbandar',
                tax: 'Non-Taxable'
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
                   <div className='relative flex flex-col w-full h-full'>
                        <h1 className="text-3xl font-bold text-center text-black mb-10 mt-10">Item Details</h1>
                        <div className="flex items-center justify-between space-x-3">
                            <div className='py-3 relative'>
                                <input type="text" placeholder="Search Here ...!" className="px-2 py-1 border rounded-lg text-sm placeholder:text-sm bg-white" style={{ borderRadius: '0.3rem' }} onChange={(e) => setSearchTableData(e.target.value)} />
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
                                    name="Add New Item"
                                    className="next-btn bg-blue-500 hover:bg-blue-400 text-white px-5 py-2 rounded flex items-center  transition duration-200 font-inter"
                                    onClick={() => { router.push('/items/new-item') }}
                                    permission_name=''
                                />
                                {/* <button
                                    className="bg-gradient-to-t from-red-500 to-red-400 px-3 py-2 rounded flex items-center space-x-1 transition duration-200 text-white hover:bg-gradient-to-t hover:from-red-400 hover:to-red-500" onClick={() => router.push(ROUTES.restore_state)}
                                >
                                    <FaTrashRestore className="text-white" />
                                    <span>Restore</span>
                                </button> */}
                                {/* <CustomButton
                                    name="Restore"
                                    className="bg-gradient-to-t from-red-500 to-red-400 px-3 py-2 rounded flex items-center space-x-1 transition duration-200 text-white hover:bg-gradient-to-t hover:from-red-400 hover:to-red-500 border-0 font-inter"
                                    onclick={() =>{}}
                                    permission_name=''
                                /> */}
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

export default ItemList