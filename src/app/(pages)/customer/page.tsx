'use client';
import Layout from '@/app/component/layout'
import { useRouter } from 'next/navigation';
import React, { JSX, useEffect, useState } from 'react'
import { GetAllParams } from '../items/items';
import DataTable, { TableColumn } from 'react-data-table-component';
import { ROUTES } from '@/app/constants/routes';
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';
import { CustomerData, deleteCus, fetchAllCustomer } from './customer';
import { toast } from 'react-toastify';
import DeleteRestoreModal from '@/app/component/modal';
import { IoSearchSharp } from 'react-icons/io5';
import CustomButton from '@/app/component/buttons/page';
import Colors from '@/app/utils/colors';
import Loader from '@/app/component/Loader/page';

export interface DataRow {
  no: number;
  customerName: string;
  email: string;
  action: JSX.Element;
}

const CustomerScreen = () => {

  const [dataRows, setDataRows] = useState<DataRow[]>([]);
  const [searchData, setSearchTableData] = useState('');
  const router = useRouter();
  const [deleteCustomerId, setCustomerId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getall();
  }, [])

  const param: Partial<GetAllParams> = {
    sortDirection: 'asc',
  }

  const headerColumn: TableColumn<DataRow>[] = [
    {
      name: 'No',
      selector: (row) => row.no.toString(),
      sortable: true,
      width: '5%',
    },
    {
      name: 'Customer Name',
      selector: (row) => row.customerName,
      sortable: true,
      cell: (row) => (
        <span
          onClick={() => router.push(`${ROUTES.view_customer}?id=${row.no}`)}
          className='cursor-pointer'
        >
          {row.customerName}
        </span>
      ),
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Action",
      width: '05%',
      cell: (row: any) => (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => router.push(`${ROUTES.view_customer}?id=${row.no}`)}
          >
            <img src='/assets/icons/view.png' alt="view" />
          </button>
              <button
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => {
                    router.push(`${ROUTES.add_customer}?id=${row.no}`)
                  }}
              >
                  <img src='/assets/icons/edit.png' />
              </button>
              <button
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => {
                    setCustomerId(row.no);
                      handleShow();
                  }}
              >
                  <img src='/assets/icons/delete.png' />
              </button>
          </div>
      ),
      ignoreRowClick: true,
  },
    // {
    //   name: 'Action',
    //   width: '06%',
    //   cell: (row: any) => (
    //     <div style={{
    //       display: 'flex',
    //       justifyContent: 'center', // Correct the alignment value here
    //       alignItems: 'center', // To vertically center items if necessary
    //       width: '100%',
    //       gap: '12px',
    //       textAlign: 'center',
    //     }}>
    //       <button
    //         style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    //         onClick={() => router.push(`${ROUTES.view_customer}?id=${row.no}`)}
    //       >
    //         <img src='/assets/icons/view.png' alt="view" />
    //       </button>

    //       <button
    //         style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    //         onClick={() => router.push(`${ROUTES.add_customer}?id=${row.no}`)}
    //       >
    //         <img src='/assets/icons/edit.png' alt="edit" />
    //       </button>

    //       <button
    //         style={{ background: 'none', border: 'none', cursor: 'pointer' }}
    //         onClick={() => {
    //           setCustomerId(row.no);
    //           handleShow();
    //         }}
    //       >
    //         <img src='/assets/icons/delete.png' alt="delete" />
    //       </button>
    //     </div>
    //   ),
    //   ignoreRowClick: true,

    // }
  ];


  const customStyles = {
    headCells: {
      style: {
        backgroundColor: 'rgba(117, 117, 117, 0.4)',
        color: 'black',
        fontSize: '14px',
        textAlign: 'center' as 'center'
      }
    }, headRow: {
      style: {
        textAlign: 'center' as 'center', // ✅ CORRECTED
      },
    },
  }

  const getall = async () => {
    try {
      setIsLoading(true);
      let res = await fetchAllCustomer(param as GetAllParams);
      setDataRows([]);
      if (res.successCode === 'FORBIDDEN' || res.successCode === 'UNAUTHORIZED') {
        handleShow();
      }
      else if (res.success) {
        const formattedData: DataRow[] = res.data.map((customer: CustomerData) => ({
          no: customer.customerId,
          customerName: customer.firstName + ' ' + customer.lastName,
          email: customer.email,
          action: <button onClick={() => { }}></button>
        }))
        setDataRows(formattedData);
      }
      else {
        setDataRows([]);
      }
    }
    catch (e) {
      console.log(e);
    }
    finally {
      setIsLoading(false);
    }
  }

  const filteredData = dataRows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(searchData.toLowerCase()));

  const handleShow = () => setIsModalOpen(true);

  const handleClose = () => {
    setIsModalOpen(false);
  }

  const deleteCustomer = async () => {
    if (deleteCustomerId) {
      let res = await deleteCus({ id: deleteCustomerId });
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

  return (
    <Layout>
      <div className="relative w-full h-full">
        <div className='relative flex flex-col w-full h-full'>
          <h1 className="text-3xl font-bold text-center text-black mb-10">Customer Details</h1>
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
                name="Add New State"
                className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter"
                style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
                onClick={() => router.push(ROUTES.add_customer)}
              />
              <CustomButton
                name="Restore"
                className="bg-gradient-to-t from-red-500 to-red-400 px-3 py-2 rounded flex items-center space-x-1 transition duration-200 text-white hover:bg-gradient-to-t hover:from-red-400 hover:to-red-500 border-0"
                onClick={() => router.push(ROUTES.restore_customer)}

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

          <DeleteRestoreModal
            isModalVisible={isModalOpen}
            title="Item"
            message=''
            onclick={deleteCustomer}
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

export default CustomerScreen