'use client';
import Layout from '@/app/component/layout'
import { useRouter } from 'next/navigation';
import React, { JSX, useEffect, useState } from 'react'
import { GetAllParams } from '../../items/items';
import { City, deleteCity, fetchAllCity, fetchAllCityByStateId } from '../../common/city_dropdown/city_controller';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ROUTES } from '@/app/constants/routes';
import { toast } from 'react-toastify';
import { IoSearchSharp } from 'react-icons/io5';
import CustomButton from '@/app/component/buttons/page';
import Colors from '@/app/utils/colors';
import Loader from '@/app/component/Loader/page';
import DeleteRestoreModal from '@/app/component/modal';

export interface DataRow {
    no: number;
    stateName: string;
    cityName: string;
    action: JSX.Element;
}

const CityScreen = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [dataRows, setDataRows] = useState<DataRow[]>([]);
    const router = useRouter();
    const [deleteCityId, setDeleteCityId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchData, setSearchData] = useState('')

    useEffect(() => {
        getall();
    }, [])

    const params: Partial<GetAllParams> = {
        sortDirection: 'asc'
    }

    const getall = async () => {
        try {
            setIsLoading(true);
            let res = await fetchAllCity(params as GetAllParams);
            console.log("Response ===============> ", res.data)
            if (res.successCode === 'FORBIDDEN' || res.successCode === 'UNAUTHORIZED') {
                handleShow();
            }
            else if (res.success) {
                const formattedData: DataRow[] = res.data.map((city: City) => ({
                    no: city.cityId,
                    stateName: city.stateName,
                    cityName: city.cityName,
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

    const headerColumn: TableColumn<DataRow>[] = [
        { name: 'No', selector: (row) => row.no.toString(), sortable: true, width: '05%' }, // Convert number to string
        { name: 'State Name', selector: (row) => row.stateName, sortable: true },
        { name: 'City Name', selector: (row) => row.cityName, sortable: true },
        {
            name: "Action",
            width: '04%',
            cell: (row: any) => (
                <div style={{ display: "flex", gap: "10px" }}><button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => router.push(`${ROUTES.add_city}?id=${row.no}`)}>
                    <img src='/assets/icons/edit.png' />
                </button> <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => { setDeleteCityId(row.no); handleShow(); }}>
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
                fontSize: "14px",
                textAlign: "center" as "center",
            },
        },
    };

    const filteredData = dataRows.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchData.toLowerCase())
    );

    const handleShow = () => setIsModalOpen(true);

    const handleClose = () => {
        setIsModalOpen(false);
    };


    const deleteItem = async () => {
        if (deleteCityId) {
            let res = await deleteCity({ id: deleteCityId });
            if (res.success == true) {
                getall();
            }
            else {
                toast.error(`🤔 ${res.message}`, { autoClose: 2000, });
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="relative w-full h-full">
            <div className='relative flex flex-col w-full h-full'>
                <h1 className="text-3xl font-bold text-center text-black mb-10">City Details</h1>
                <div className="flex items-center justify-between space-x-3">
                    <div className='py-3 relative'>
                        <input
                            type="text"
                            placeholder="Search Here ...!"
                            className="px-2 py-1 border rounded-lg text-sm placeholder:text-sm bg-white text-black"
                            style={{ borderRadius: '0.3rem' }}
                            onChange={(e) => setSearchData(e.target.value)}
                        />
                        <IoSearchSharp className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    </div>
                    <div className='flex space-x-3 mx-3'>
                        <CustomButton
                            name="Add New City"
                            className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter"
                            style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
                            onClick={() => router.push(ROUTES.add_city)}
                        />
                        <CustomButton
                            name="Restore"
                            className="bg-gradient-to-t from-red-500 to-red-400 px-3 py-2 rounded flex items-center space-x-1 transition duration-200 text-white hover:bg-gradient-to-t hover:from-red-400 hover:to-red-500 border-0"
                            onClick={() => router.push(ROUTES.restore_city)}

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
                            noDataComponent="No records found!"
                            className='font-inter rounded'
                        />
                    )}
                </div>
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
    )
}

export default CityScreen