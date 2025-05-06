'use client'
import CustomButton from '@/app/component/buttons/page'
import Layout from '@/app/component/layout'
import React, { JSX, useEffect, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { IoSearchSharp } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { GetAllItemData, getAllItems, GetAllParams, softDeleteItem } from './items'
import Loader from '@/app/component/Loader/page'
import Colors from '@/app/utils/colors'
import DeleteRestoreModal from '@/app/component/modal'
import CustomModal from './modal'
import { toast } from 'react-toastify'
import { ROUTES } from '@/app/constants/routes'

export interface DataRow {
    no: number;
    type: string;
    name: string;
    hsn: string;
    unit: string;
    tax: string;
    action: JSX.Element;
}

const ItemList = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [dataRows, setDataRows] = useState<DataRow[]>([])
    const [searchData, setSearchTableData] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null)

    const params: Partial<GetAllParams> = {
        sortDirection: 'asc'
    }

    const headerColumn: TableColumn<DataRow>[] = [
        { name: 'No', sortable: true, selector: row => row.no, width: '05%' },
        { name: 'Name', sortable: true, selector: row => row.name },
        { name: 'Type', sortable: true, selector: row => row.type, width: '10%' },
        { name: 'HSN/SAC Code', sortable: true, selector: row => row.hsn },
        { name: 'Unit', sortable: true, selector: row => row.unit },
        { name: 'Tax Preference', sortable: true, selector: row => row.tax },
        {
            name: "Action",
            width: '04%',
            cell: (row: any) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => {
                            router.replace(`/items/new-item?id=${row.no}`)
                        }}
                    >
                        <img src='/assets/icons/edit.png' />
                    </button>
                    <button
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                        onClick={() => {
                            setDeleteItemId(row.no.toString());
                            handleShow();
                        }}
                    >
                        <img src='/assets/icons/delete.png' />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        },
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
    }

    const filteredData = dataRows.filter((row) =>
        Object.values(row).join(" ").toLowerCase().includes(searchData.toLowerCase())
    )

    useEffect(() => {
        get()
    }, [])

    const get = async () => {
        try {
            setIsLoading(true)
            let res = await getAllItems(params as GetAllParams)
            if (res.successCode === 'FORBIDDEN' || res.successCode === 'UNAUTHORIZED') {
                // Handle auth issues
            } else if (res.success) {
                const formattedData: DataRow[] = res.data.map((item: GetAllItemData) => ({
                    no: item.productId,
                    hsn: item.type.toLowerCase() === 'goods' ? (item.hsnCode || '') : (item.sacCode || ''),
                    name: item.productName,
                    tax: item.taxPreference,
                    type: item.type,
                    unit: item.unit,
                    action: <></>,
                }))
                setDataRows(formattedData)
            } else {
                setDataRows([])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteItem = async () => {
        if (deleteItemId) {
            let res = await softDeleteItem({id: deleteItemId});
            if(res.success == true)
            {
                get()
            }
            else{
                toast.error(`🤔 ${res.message}`, { autoClose : 2000})
            } 
        }
        setIsModalOpen(false)
    }

    const handleShow = () => setIsModalOpen(true)
    const handleClose = () => setIsModalOpen(false)

    return (
        <Layout>
            <div className="relative w-full h-full">
                <div className='relative flex flex-col w-full h-full'>
                    <h1 className="text-3xl font-bold text-center text-black mb-10">Item Details</h1>
                    <div className="flex items-center justify-between space-x-3">
                        <div className='py-3 relative'>
                            <input
                                type="text"
                                placeholder="Search Here ...!"
                                className="px-2 py-1 border rounded-lg text-sm placeholder:text-sm bg-white"
                                style={{ borderRadius: '0.3rem' }}
                                onChange={(e) => setSearchTableData(e.target.value)}
                            />
                            <IoSearchSharp className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        </div>
                        <div className='flex space-x-3 mx-3'>
                            <CustomButton
                                name="Add New Item"
                                className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter"
                                style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
                                onClick={() => { router.replace('/items/new-item') }}
                            />
                            <CustomButton
                                name="Restore"
                                className="bg-gradient-to-t from-red-500 to-red-400 px-3 py-2 rounded flex items-center space-x-1 transition duration-200 text-white hover:bg-gradient-to-t hover:from-red-400 hover:to-red-500 border-0"
                                onClick={() => router.push(ROUTES.restore_item)}
                              
                            />
                        </div>
                    </div>

                    <div>
                        {isLoading ? (
                            <div className="flex-grow">
                                <div className="absolute inset-0 flex justify-center items-center">
                                    <Loader isInside={true} />
                                </div>
                            </div>
                        ) : (
                            <DataTable
                                columns={headerColumn}
                                data={filteredData}
                                fixedHeader
                                customStyles={customStyles}
                                pagination
                                highlightOnHover
                                noDataComponent="No records found!"
                                className='font-inter rounded'
                            />
                        )}
                    </div>

                    {/* Delete Modal (already existing) */}


                    {/* New: Edit Modal */}
                    {/* <CustomModal
                        show={isModalOpen}
                        onClose={() => handleClose()}
                        title="Edit Item"
                        message={`You are editing item: `}
                    /> */}
                    <DeleteRestoreModal
                        isModalVisible={isModalOpen}
                        title="Item"
                        message=''
                        onclick={deleteItem}
                        onHide={handleClose}
                        closeNoBtn={handleClose}
                        okBtn={handleClose}
                        hasPermissionChanged={false}
                    />
                </div>
            </div>
        </Layout>
    )
}

export default ItemList
