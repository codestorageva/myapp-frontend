'use client'
import Layout from '@/app/component/layout'
import React, { JSX, useEffect, useState } from 'react'
import { getAllInvoice, InvoiceData } from '../generate-invoice';
import { useRouter } from 'next/navigation';
import DataTable, { TableColumn } from 'react-data-table-component';
import { GetAllParams } from '../../items/items';
import { IoSearchSharp } from 'react-icons/io5';
import Loader from '@/app/component/Loader/page';
import { ROUTES } from '@/app/constants/routes';

export interface DataRow {
    no: number;
    invoiceNumber: string;
    action: JSX.Element;
}

const ViewInvoice = () => {

    const [dataRows, setDataRows] = useState<DataRow[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [invoiceListData, setInvoiceData] = useState<InvoiceData[]>([]);
    const [searchData, setSearchTableData] = useState('');
    const router = useRouter();

    useEffect(() => {
        getAll();
    }, []);

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
            name: 'Invoice Number',
            selector: (row) => row.invoiceNumber,
            sortable: true,
            cell: (row) => (
                <span
                    onClick={() => {router.push(`${ROUTES.view_invoice}?id=${row.no}`) }}
                    className='cursor-pointer'
                >
                    {row.invoiceNumber}
                </span>
            ),
        },
        {
            name: 'Action',
            width: '5%',
            cell: (row: any) => (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                }}>
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                        }}
                        onClick={() => router.push(`${ROUTES.view_invoice}?id=${row.no}`) }
                    >
                        <img src="/assets/icons/view.png" alt="view" width={15} height={15} />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    const getAll = async () => {
        try {
            setIsLoading(true);
            const res = await getAllInvoice();
            if (res.success) {
                const formattedData: DataRow[] = res.data.map((invoice: InvoiceData) => ({
                    no: invoice.invoiceId,
                    invoiceNumber: invoice.invoicePrefix + " " + invoice.invoiceNumber,
                    action: <button onClick={() => { }}></button>
                }))
                setDataRows(formattedData);
            }
            else {
                setDataRows([]);
            }
        }
        catch (err: any) { }
        finally {
            setIsLoading(false);
        }
    }

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: 'rgba(117, 117, 117, 0.4)',
                color: 'black',
                fontSize: '14px',
                textAlign: 'center' as 'center',
            }
        }, headRow: {
            style: {
                textAlign: 'center' as 'center', // ✅ CORRECTED
            },
        },
    }

    const filteredData = dataRows.filter((row) => Object.values(row).join(' ').toLowerCase().includes(searchData.toLowerCase()));

    return (
        <Layout>
            <div className="relative w-full h-full">
                <div className='relative flex flex-col w-full h-full'>
                    <h1 className="text-3xl font-bold text-center text-black mb-10">Invoice Details</h1>
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

                </div>
            </div>
        </Layout>

    )
}

export default ViewInvoice


export const MyComponent = ({ data, columns }: { data: DataRow[], columns: TableColumn<DataRow>[] }) => (
    <DataTable
        columns={columns}
        data={data}
    />
);