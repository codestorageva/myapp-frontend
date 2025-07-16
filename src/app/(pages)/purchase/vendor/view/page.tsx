'use client'
import { CustomerData } from '@/app/(pages)/customer/customer';
import Loader from '@/app/component/Loader/page';
import ViewCard from '@/app/component/view_card';
import { ROUTES } from '@/app/constants/routes';
import Colors from '@/app/utils/colors';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { TabContent } from 'react-bootstrap';
import StateMent from './statement/page';

const VendorView = () => {

    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [isLoading, setIsLoading] = useState(true)
    const [customerData, setCustomerData] = useState<any>({});
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isBillsOpen, setIsBillsOpen] = useState(false);
    const router= useRouter()
   
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 3000)
        return () => clearTimeout(timer);
    }, [])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setCustomerData({
            contactPersons: [
                {
                    salutation: "Mr.",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    workPhone: "123-456-7890",
                    mobileNumber: "987-654-3210"
                },
                {
                    salutation: "Ms.",
                    firstName: "Jane",
                    lastName: "Smith",
                    email: "jane.smith@example.com",
                    workPhone: "111-222-3333",
                    mobileNumber: "444-555-6666"
                }
            ]
        });
    }, []);

    return (
        <div className='w-full flex flex-col items-center p-5'>
            {isLoading && <Loader isInside={true}></Loader>}
            {!isLoading && <>
                <div className="w-[100%] flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Vendor Details
                    </h1>

                    {/* Transaction Dropdown */}
                    <div className="relative inline-block text-left" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setShowDropdown(prev => !prev)}
                            className="inline-flex justify-center rounded-md border text-white border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium hover:bg-gray-50"
                            style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
                        >
                            New Transactions
                            <svg
                                className="-mr-1 ml-2 h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 011.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {showDropdown && (
                            <div
                                className="absolute right-0 mt-2 w-52 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                            >
                                <div className="py-1">
                                    <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left" onClick={() => { setShowDropdown(false); }} >
                                        Bill
                                    </button>
                                    <button
                                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left" onClick={() => { setShowDropdown(false);
                                            router.push(`${ROUTES.bill_payment}?id=1`)
                                         }} >
                                        Bill Payment
                                    </button>
                                    <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left" onClick={() => { console.log('Download PDF'); setShowDropdown(false); }} >
                                        Expense
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
                <Tabs defaultValue="details" className="w-full">
                    {/* Tabs Header */}
                    <TabsList className="w-full flex justify-start border-b border-gray-200 bg-transparent p-0">
                        <TabsTrigger
                            value="details"
                            className="px-6 py-2 text-sm font-medium border-b-2 border-transparent hover:border-gray-400 data-[state=active]:border-red-500 data-[state=active]:text-red-500 transition-colors"                        >
                            Details
                        </TabsTrigger>
                        <TabsTrigger
                            value="transaction"
                            className="px-6 py-2 text-sm font-medium border-b-2 border-transparent hover:border-gray-400 data-[state=active]:border-red-500 data-[state=active]:text-red-500 transition-colors"                        >
                            Transaction
                        </TabsTrigger>
                        <TabsTrigger value='statement' className='px-6 py-2 text-sm font-medium border-b-2 border-transparent hover:border-gray-400 data-[state=active]:border-red-500 data-[state=active]:text-red-500 transition-colors'>
                            Statement
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="details">
                        <div className="w-[100%] bg-white border rounded-lg shadow-sm p-6 space-y-6">
                            {/* Basic Details */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-700 mb-4">Basic Information</h2>
                                {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4"> */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                                    <ViewCard value="Mr. Jay Shah" label="Full Name" />
                                    <ViewCard value="Vaistra Technologies" label="Company Name" />
                                    <ViewCard value="Jay" label="Display Name" />
                                    <ViewCard value="jay@gmail.com" label="Email" />
                                    <ViewCard value="+91 1234567890" label="Work Phone" />
                                    <ViewCard value="9989356566" label="Mobile Number" />
                                    <ViewCard value="ASD3432987SD" label="PAN Number" />
                                    <ViewCard value="Due on Receipt" label="Payment Term" />
                                </div>
                            </section>

                            {/* Contact Person */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-700 underline mb-3">
                                    Contact Person
                                </h2>
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full text-sm text-left border-collapse">
                                        <thead className="bg-gray-100 text-gray-700 font-semibold">
                                            <tr>
                                                <th className="px-4 py-2">Salutation</th>
                                                <th className="px-4 py-2">First Name</th>
                                                <th className="px-4 py-2">Last Name</th>
                                                <th className="px-4 py-2">Email</th>
                                                <th className="px-4 py-2">Work Phone</th>
                                                <th className="px-4 py-2">Mobile</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customerData?.contactPersons?.map((contact: { salutation: string | undefined; firstName: string | undefined; lastName: string | undefined; email: string | undefined; workPhone: string | undefined; mobileNumber: string | undefined; }, index: React.Key | null | undefined) => (
                                                <tr key={index} className="border-t hover:bg-gray-50">
                                                    <td className="px-4 py-2"><ViewCard value={contact.salutation} /></td>
                                                    <td className="px-4 py-2"><ViewCard value={contact.firstName} /></td>
                                                    <td className="px-4 py-2"><ViewCard value={contact.lastName} /></td>
                                                    <td className="px-4 py-2"><ViewCard value={contact.email} /></td>
                                                    <td className="px-4 py-2"><ViewCard value={contact.workPhone} /></td>
                                                    <td className="px-4 py-2"><ViewCard value={contact.mobileNumber} /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Address Section */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-700 underline mb-3">Address</h2>

                                {/* Billing Address */}
                                <div className="mb-6">
                                    <h3 className="text-md font-semibold text-gray-600">Billing Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                        <ViewCard label="Attention" value={customerData?.billingAttention} />
                                        <ViewCard label="Address Line 1" value={customerData?.billingAddressLine1} />
                                        <ViewCard label="Address Line 2" value={customerData?.billingAddressLine2} />
                                        <ViewCard label="State" value={customerData?.billingStateName} />
                                        <ViewCard label="City" value={customerData?.billingCityName} />
                                        <ViewCard label="Pincode" value={customerData?.billingPincode} />
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h3 className="text-md font-semibold text-gray-600">Shipping Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                        <ViewCard label="Attention" value={customerData?.shippingAttention} />
                                        <ViewCard label="Address Line 1" value={customerData?.shippingAddressLine1} />
                                        <ViewCard label="Address Line 2" value={customerData?.shippingAddressLine2} />
                                        <ViewCard label="State" value={customerData?.shippingStateName} />
                                        <ViewCard label="City" value={customerData?.shippingCityName} />
                                        <ViewCard label="Pincode" value={customerData?.shippingPincode} />
                                    </div>
                                </div>
                            </section>

                            {/* Bank Details */}
                            <section>
                                <h2 className="text-lg font-semibold text-gray-700 underline mb-3">
                                    Bank Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ViewCard label="Account Holder Name" value="Jay Shah" />
                                    <ViewCard label="Bank Name" value="HDFC Bank" />
                                    <ViewCard label="Branch Name" value="Satellite" />
                                    <ViewCard label="Account Number" value="1234567890" />
                                    <ViewCard label="IFSC Code" value="HDFC0001234" />
                                    <ViewCard label="Bank Address" value="Ahmedabad, Gujarat" />
                                </div>
                            </section>
                        </div>
                    </TabsContent>
                    <TabsContent value="transaction">
                        <div className="w-full bg-white border rounded-xl shadow p-6">
                            {/* Bills Section */}
                            <div className="rounded-lg border border-gray-200 shadow-sm mb-6">
                                {/* Header */}
                                <div
                                    className="flex items-center justify-between px-4 py-2 bg-gray-50 cursor-pointer rounded-t-lg hover:bg-gray-100 transition"
                                    onClick={() => setIsBillsOpen(!isBillsOpen)}
                                >

                                    Bills

                                </div>

                                {/* Content */}
                                {isBillsOpen && (
                                    <div className="px-0 py-1">
                                        <table className="w-full text-sm table-auto border-spacing-y-2 border-separate">
                                            <thead>
                                                <tr className="text-gray-600 bg-gray-100">
                                                    <th className="text-left px-3 py-2">Date</th>
                                                    <th className="text-left px-3 py-2">Bill #</th>
                                                    <th className="text-left px-3 py-2">Order #</th>
                                                    <th className="text-left px-3 py-2">Vendor</th>
                                                    <th className="text-right px-3 py-2">Amount</th>
                                                    <th className="text-right px-3 py-2">Balance</th>
                                                    <th className="text-center px-3 py-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-800">
                                                {[
                                                    {
                                                        date: "23/07/2025",
                                                        bill: "1275",
                                                        order: "1121",
                                                        vendor: "abc",
                                                        amount: "₹1,600.00",
                                                        balance: "₹1,600.00",
                                                        status: "Open",
                                                    },
                                                    {
                                                        date: "15/07/2025",
                                                        bill: "123456",
                                                        order: "111",
                                                        vendor: "abc",
                                                        amount: "₹98.00",
                                                        balance: "₹0.00",
                                                        status: "Paid",
                                                    },
                                                ].map((item, index) => (
                                                    <tr key={index} className="bg-white hover:bg-gray-50 transition">
                                                        <td className="px-3 py-2">{item.date}</td>
                                                        <td className="px-3 py-2 cursor-pointer">{item.bill}</td>
                                                        <td className="px-3 py-2">{item.order}</td>
                                                        <td className="px-3 py-2">{item.vendor}</td>
                                                        <td className="px-3 py-2 text-right">{item.amount}</td>
                                                        <td className="px-3 py-2 text-right">{item.balance}</td>
                                                        <td className="px-3 py-2 text-center">
                                                            <span
                                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === "Paid"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-yellow-100 text-yellow-700"
                                                                    }`}
                                                            >
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>


                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value='statement'>
                        <StateMent/>
                    </TabsContent>


                </Tabs>



            </>}

        </div>
    )
}

export default VendorView