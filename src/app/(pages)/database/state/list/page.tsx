'use client';
import Layout from '@/app/component/layout'
import React, { JSX, useEffect, useState } from 'react'
import { deleteState, fetchAllState, State } from '../../../common/state_dropdown/state_controller';
import { useRouter } from 'next/navigation';
import { GetAllParams } from '../../../items/items';
import DataTable, { TableColumn } from 'react-data-table-component';
import { toast } from 'react-toastify';
import { IoSearchSharp } from 'react-icons/io5';
import CustomButton from '@/app/component/buttons/page';
import { ROUTES } from '@/app/constants/routes';
import Colors from '@/app/utils/colors';
import Loader from '@/app/component/Loader/page';
import DeleteRestoreModal from '@/app/component/modal';
import Image from 'next/image'; 
import { noDataFound } from '@/app/utils/path'
export interface DataRow {
    no: number;
    stateName: string;
    action: JSX.Element;
}

const StateScreen = () => {

    const [states, setStates] = useState<State[]>([]);
    const [dataRows, setDataRows] = useState<DataRow[]>([]);
    const [searchData, setSearchTableData] = useState('');
    const router = useRouter()
    const [deleteStateId, setDeleteStateId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getall();
    }, [])

    const params: Partial<GetAllParams> = {
        sortDirection: 'asc',
        sortBy: 'stateName'
    }

    const headerColumn: TableColumn<DataRow>[] = [
        { name: 'NO', selector: (row) => row.no.toString(), sortable: true, width: '100px' }, // Convert number to string
        { name: 'STATE NAME', selector: (row) => row.stateName, sortable: true },
        {
            name: "ACTION",
            width: '100px',
            cell: (row: any) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => { router.push(`${ROUTES.add_state}?id=${row.no}`) }}>
                        <img src='/assets/icons/edit.png' />
                    </button>

                    <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => { setDeleteStateId(row.no); handleShow(); }}>
                        <img src='/assets/icons/delete.png' />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: "rgba(117, 117, 117, 0.4)",
                color: "black",
                fontSize: "12px",
                textAlign: "center" as "center",
            },
        },
    };

    const getall = async () => {
        try {
            setIsLoading(true);
            let res = await fetchAllState(params as GetAllParams);
            if (res.successCode === 'FORBIDDEN' || res.successCode === 'UNAUTHORIZED') {
                handleShow();
            }
            else if (res.success) {
                const formattedData: DataRow[] = res.data.map((state: State) => ({
                    no: state.stateId,
                    stateName: state.stateName,
                    action: <button onClick={() => { }}></button>
                }));
                setDataRows(formattedData);
            } else {
                setDataRows([]);
            }
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setIsLoading(false)
        }
    }

    const filteredData = dataRows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(searchData.toLowerCase()))

    const handleShow = () => setIsModalOpen(true);

    const handleClose = () => {
        setIsModalOpen(false);
    }

    const deleteStateItem = async () => {
        if (deleteStateId) {
            let res = await deleteState({ id: deleteStateId });
            if (res.success) {
                getall();
            }
            else {
                toast.error(`🤔 ${res.message}`, {
                    autoClose: 2000,
                });
            }
            setIsModalOpen(false);
        }
    }

    return (<div className="relative w-full h-full  p-5">
        <div className='relative flex flex-col w-full h-full'>
            <h1 className="text-3xl font-bold text-center text-black mb-10">State Details</h1>
            <div className="flex items-center justify-between space-x-3 text-black">
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
                        name="Add New State"
                        className="text-white px-4 py-2 rounded-lg text-sm border-none transition font-inter"
                        style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
                        onClick={() => router.push(ROUTES.add_state)}
                    />
                    <CustomButton
                        name="Restore"
                        className="text-white px-4 py-2 rounded-lg text-sm border-none transition font-inter shadow-md hover:shadow-lg hover:brightness-105"
                        style={{
                            background: 'linear-gradient(to right, #4b5563, #9ca3af)', // Gray-600 to Gray-400
                        }} onClick={() => router.push(ROUTES.restore_state)}

                    />
                </div>
            </div>

            <div>
                {isLoading ? (
                    <div className="flex-grow">
                        <div className=" inset-0 flex justify-center items-center">
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
                        noDataComponent={
                            <div className="flex flex-col items-center justify-center py-6 w-full rounded-full">
                                <Image
                                    src={noDataFound}
                                    alt="No Data Found"
                                    width={300}
                                    height={300}
                                    className="mb-4"
                                />
                            </div>
                        }
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
                title="State"
                message=''
                onclick={deleteStateItem}
                onHide={handleClose}
                closeNoBtn={handleClose}
                okBtn={handleClose}
                hasPermissionChanged={false}
            />
        </div>
    </div>

    )
}

export default StateScreen