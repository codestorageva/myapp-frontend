'use client';
import CustomButton from '@/app/component/buttons/page';
import Loader from '@/app/component/Loader/page';
import { ROUTES } from '@/app/constants/routes';
import Colors from '@/app/utils/colors';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { IoSearchSharp } from 'react-icons/io5';
import { VendorDataRow } from './vendor_controller';
import Image from 'next/image';
import { noDataFound } from '@/app/utils/path'

const Vendors = () => {
  const router = useRouter();
  const [searchData, setSearchTableData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataRows, setDataRows] = useState<VendorDataRow[]>([]);
  const [selectedVendorId, setCustomerId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headerColumn: TableColumn<VendorDataRow>[] = [
    { name: 'NAME', selector: (row) => row.name, sortable: true, cell: (row)=> (
      <span onClick={()=>{ router.push(`${ROUTES.view_vendor_details}?id=${row.no}`)}} className={`cursor-pointer hover:text-[#af0000]`}>{row.name}</span>
    )},
    { name: 'COMPANY NAME', selector: (row) => row.companyName, sortable: true },
    { name: 'EMAIL', selector: (row) => row.email, sortable: true },
    { name: 'WORK PHONE', selector: (row) => row.workPhone, sortable: true },
    { name: 'PAYABLE(BCY)', selector: (row) => `₹ ${parseFloat(row.payables).toFixed(2)}`, sortable: true },
    { name: 'UNUSED CREDITS(BCY)', selector: (row) => `₹ ${parseFloat(row.unusedCredit).toFixed(2)}`, sortable: true }
  ]

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


  const data: VendorDataRow[] = [
    {
      no: 1,
      action: <button onClick={() => { }}></button>,
      companyName: 'vaistra',
      email: 'jay@gmail.com',
      name: 'Jay Shah',
      payables: '0.00',
      unusedCredit: '0.00',
      workPhone: '1234567890'
    },
    {
      no: 2,
      action: <button onClick={() => { }}></button>,
      companyName: 'abc info',
      email: 'niya@gmail.com',
      name: 'Niya Desai',
      payables: '0.00',
      unusedCredit: '0.00',
      workPhone: '1234567890'
    }
  ]

  useEffect(() => {
    setDataRows(data);
  }, [])

  const filteredData = dataRows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(searchData.toLowerCase()));

  const handleShow = () => setIsModalOpen(true);

  const handleClose = () => {
    setIsModalOpen(false);
  }

  return (
    <div className='relative w-full h-full p-5'>
      <div className='relative flex flex-col w-full h-full'>
        <h1 className='text-3xl font-bold text-center text-black mb-10'>Vendors</h1>
        <div className='flex items-center justify-between space-x-3 text-black'>
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
              name="Add New Vendor"
              className="text-white px-4 py-2 rounded-lg text-sm  border-none transition font-inter"
              style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
              onClick={() => router.push(ROUTES.add_vendor)}
            />
            <CustomButton
              name="Restore"
              className="text-white px-4 py-2 rounded-lg text-sm border-none transition font-inter shadow-md hover:shadow-lg hover:brightness-105"
              style={{
                background: 'linear-gradient(to right, #4b5563, #9ca3af)', // Gray-600 to Gray-400
              }} onClick={() => router.push(ROUTES.restore_vendor)}

            />
          </div>
        </div>

        <div>
          {isLoading ? (
            <div className="flex-grow">
              <div className="inset-0 flex justify-center items-center">
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
      </div>
    </div>
  );
};

export default Vendors;
