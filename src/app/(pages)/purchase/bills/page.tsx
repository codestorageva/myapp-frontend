'use client'
import CustomButton from '@/app/component/buttons/page'
import { ROUTES } from '@/app/constants/routes'
import Colors from '@/app/utils/colors'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5'
import { BillDataRow } from './bill_controller'
import DataTable, { TableColumn } from 'react-data-table-component'
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align'
import Loader from '@/app/component/Loader/page'
import { noDataFound } from '@/app/utils/path'
import Image from 'next/image';

const Bills = () => {

  const router = useRouter()
  const [searchData, setSearchTableData] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [dataRows, setDataRows] = useState<BillDataRow[]>([])

  const headerColumn: TableColumn<BillDataRow>[] = [
    { name: 'DATE', selector: (row) => row.date, sortable: true, width: 'auto' },
    {
      name: 'BILL #', selector: (row) => row.bill, sortable: true, cell: (row) => {
        return (
          <span onClick={() => { router.push(`${ROUTES.view_bill}?id=${row.bill}`) }} className='cursor-pointer'>{row.bill}</span>
        )
      }
    },
    { name: 'REFERENCE NUMBER', selector: (row) => row.refrenceNo, sortable: true, width: 'auto' },
    { name: 'VENDOR NAME', selector: (row) => row.vendorName, sortable: true },
    {
      name: 'STATUS', selector: (row) => row.status, sortable: true, cell: (row) => {
        const status = row.status?.toLowerCase();

        const statusColorMap: Record<string, string> = {
          paid: 'text-green-800',
          unpaid: 'text-red-800',
          overdue: 'text-yellow-800',
          pending: 'text-blue-800',
        };

        const badgeClass = statusColorMap[status] || ' text-gray-800';

        return (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold capitalize ${badgeClass}`}
          >
            {status.toLocaleUpperCase()}
          </span>
        );
      },
    },
    { name: 'DUE DATE', selector: (row) => row.dueDate, sortable: true },
    { name: 'AMOUNT', selector: (row) => `₹ ${parseFloat(row.amount).toFixed(2)}`, sortable: true,},
    { name: 'BALANCE DUE', selector: (row) => `₹ ${parseFloat(row.balanceDue).toFixed(2)}`, sortable: true }
  ]

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: 'rgba(117, 117, 117, 0.4)',
        color: 'black',
        fontSize: '12px',
        textAlign: 'center' as 'center'
      }
    },
    headRow: {
      style: {
        textAlign: 'center' as 'center'
      }
    }
  }

  const data: BillDataRow[] = [
    {
      date: '15/07/2025',
      bill: '1234',
      refrenceNo: '11',
      vendorName: 'Vijay',
      status: 'paid',
      dueDate: '15/07/2025',
      amount: '98.00',
      balanceDue: '0.00'
    }
  ]

  const filteredData = dataRows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(searchData.toLowerCase()))

  useEffect(() => {
    setDataRows(data);
  }, [])

  return (
    <div className='relative w-full h-full p-5'>
      <div className='relative flex flex-col w-full h-full'>
        <h1 className='text-3xl font-bold text-center text-black mb-10'>All Bills</h1>
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
              name="Create Bill"
              className="text-white px-4 py-2 rounded-lg text-sm  border-none transition font-inter"
              style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
              onClick={() => router.push(ROUTES.add_bill)}
            />
          </div>
        </div>
        <div>
          {
            isLoading ? (
              <div className='flex-grow'>
                <div className='inset-0 flex justify-center items-center'>
                  <Loader isInside />
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
                  <div className='flex flex-col items-center justify-center py-6 w-full rounded-full'>
                    <Image
                      src={noDataFound}
                      alt=''
                      width={300}
                      height={300}
                      className='mb-4' />
                  </div>
                }
                className='font-inter rounded'
              ></DataTable>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Bills