'use client';
import React, { JSX, useEffect, useState } from 'react'
import { GetAllItemData, GetAllParams, getAllResotreItems, restoreItem } from '../items';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useRouter } from 'next/navigation';
import { GoSync } from 'react-icons/go';
import Colors from '@/app/utils/colors';
import { toast } from 'react-toastify';
import Layout from '@/app/component/layout';
import { IoSearchSharp } from 'react-icons/io5';
import CustomButton from '@/app/component/buttons/page';
import { GrPrevious } from 'react-icons/gr';
import Loader from '@/app/component/Loader/page';
import DeleteRestoreModal from '@/app/component/modal';
import { noDataFound } from '@/app/utils/path';
import Image from 'next/image'; 

export interface DataRow {
  no: number;
  type: string;
  name: string;
  hsn: string;
  unit: string;
  tax: string;
  action: JSX.Element;
}

const RestoreItems = () => {
  const [dataRows, setDataRows] = useState<DataRow[]>([])
  const [searchData, setSearchTableData] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const [restoreItemId, setRestoreItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const params: Partial<GetAllParams> = {
    isDeleted: true,
    sortDirection: 'asc'
  };

  const headerColumn: TableColumn<DataRow>[] = [
    { name: 'NO', sortable: true, selector: row => row.no, width: '70PX' },
    { name: 'NAME', sortable: true, selector: row => row.name },
    { name: 'TYPE', sortable: true, selector: row => row.type, width: '10%' },
    { name: 'HSN/SAC CODE', sortable: true, selector: row => row.hsn },
    { name: 'UNIT', sortable: true, selector: row => row.unit },
    { name: 'TAX PREFERENCE', sortable: true, selector: row => row.tax },
    {
      name: "Action",
      width: '70px',
      cell: (row: any) => (
        <div className="flex flex-col items-center justify-center">

          <button className="bg-transparent border-none cursor-pointer" onClick={() => { setRestoreItemId(row.no); setIsModalOpen(true) }}>
            <GoSync size={18} color={Colors.gradient1} />
          </button>

        </div>
      ),
      ignoreRowClick: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "rgba(117, 117, 117, 0.5)",
        color: "black",
        fontSize: "12px",
        textAlign: "center" as "center"
      }
    }
  }

  const getall = async () => {
    try {
      setIsLoading(true)
      let res = await getAllResotreItems(params as GetAllParams);
      setIsLoading(false)
      if (res.successCode == 'FORBIDDEN' || res.successCode == 'UNAUTHORIZED') {
        handleShow();
      }
      else if (res.success) {
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
      }
      else {
        setDataRows([]);
      }
    }
    catch (e) {
      console.error(e)
    }
    finally {
      setIsLoading(false)
    }
  }

  const filteredData = dataRows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(searchData.toLowerCase()))

  useEffect(() => {
    getall();
  }, [])

  const restoreSingleItem = async () => {
    if (restoreItemId) {
      let res = await restoreItem(restoreItemId);
      if (res.success) {
        getall();
        toast.success(`🎉 ${res.message}`, {
          autoClose: 2000,
        });
      }
      else {
        toast.error(`🤔 ${res.message}`, { autoClose: 2000 })
      }
    }
    handleClose();
  }

  const handleShow = () => setIsModalOpen(true);

  const handleClose = () => {
    setIsModalOpen(false);
  }

  return (

    <div className="relative w-full h-full p-5">
      <div className='relative flex flex-col w-full h-full'>
        <h1 className="text-3xl font-bold text-center text-black mb-10">Deleted Item Details</h1>
        <div className="flex items-center justify-between space-x-3">
          <div className='py-3 relative'>
            <input
              type="text"
              placeholder="Search Here ...!"
              className="px-2 py-1 border rounded-lg text-sm placeholder:text-sm bg-white text-black"
              style={{ borderRadius: '0.3rem' }}
              onChange={(e) => setSearchTableData(e.target.value)}
            />
            <IoSearchSharp className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          </div>
          <div className='flex space-x-3 mx-3'>
            <CustomButton
              name="Back"
              // type="submit"
              type="button"
              onClick={() => {
                router.back();
              }}
              className="previous-btn  mt-3 mb-2 "
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
        <DeleteRestoreModal
          isModalVisible={isModalOpen}
          title="Item"
          message=''
          onclick={restoreSingleItem}
          onHide={handleClose}
          closeNoBtn={handleClose}
          okBtn={handleClose}
          hasPermissionChanged={false}
          isSoftDeletePage={true}
        />
      </div>
    </div>

  )
}

export default RestoreItems