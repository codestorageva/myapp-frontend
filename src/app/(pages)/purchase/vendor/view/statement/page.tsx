import Colors from '@/app/utils/colors';
import { parse } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import Image from 'next/image';
import { noDataFound } from '@/app/utils/path'

const StateMent = () => {

    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const [dateData, setDateData] = useState('Today')
    const [showCalendar, setShowCalendar] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
                setShowCalendar(false)
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const dropdown = [
        'Today',
        'This Week',
        'This Month',
        'This Quarter',
        'This Year',
        'Yesterday',
        'Previous Week',
        'Previous Month',
        'Previous Year',
        'Custom'
    ]

    const data = [
        {
            date: '01/07/2025',
            transaction: '****Opening Balance****',
            details: '',
            amount: '0.00',
            payments: '',
            balance: '0.00'
        },
        {
            date: '09/07/2025',
            transaction: 'Bill',
            details: '123 - due on 24/07/2025',
            amount: '800.00',
            payments: '',
            balance: '800.00'
        },
        {
            date: '09/07/2025',
            transaction: 'Tax Withheld',
            details: 'Bill Number - 111',
            amount: '',
            payments: '30.00',
            balance: '770.00'
        },
        {
            date: '10/07/2025',
            transaction: 'Payment Made',
            details: '₹500.00 for payment of 111',
            amount: '',
            payments: '500.00',
            balance: '270.00'
        }
    ]

    const filteredData = data.filter((row) => {
        const parsedDate = parse(row.date, 'dd/MM/yyyy', new Date());
        return parsedDate >= fromDate && parsedDate <= toDate;
    });


    const getDataRange = (type: string) => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth();
        let start = new Date();
        let end = new Date();

        switch (type) {
            case 'Today':
                start = end = today;
                break;

            case 'This Week':
                const day = today.getDay();
                const diffToMonday = day === 0 ? -6 : 0 - day;
                const diffToSunday = day === 0 ? 0 : 6 - day;
                start.setDate(today.getDate() + diffToMonday);
                end.setDate(today.getDate() + diffToSunday);
                break;
            case 'This Month':
                start = new Date(currentYear, currentMonth, 1);
                end = new Date(currentYear, currentMonth + 1, 0)
                break;
            case 'This Quarter':
                const quarter = Math.floor(currentMonth / 3);
                console.log(quarter);
                start = new Date(currentYear, quarter * 3, 1);
                console.log(start);
                end = new Date(currentYear, quarter * 3 + 3, 0);
                console.log(end)
                break;
            case 'This Year':
                start = new Date(currentYear, 3, 1);
                end = new Date(currentYear + 1, 2, 31);
                break;
            case 'Yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'Previous Week':
                const weekDay = today.getDay();
                const diff = today.getDate() - weekDay + (weekDay === 0 ? -6 : 0) - 7;
                start = new Date(today.setDate(diff));
                end = new Date(start);
                end.setDate(start.getDate() + 6);
                break;
            case 'Previous Month':
                start = new Date(currentYear, currentMonth - 1, 1);
                end = new Date(currentYear, currentMonth, 0);
                break;
            case 'Previous Year':
                start = new Date(currentYear - 1, 3, 1);
                end = new Date(currentYear, 2, 31);
                break;
            case 'Custom':

                break;
        }

        return { start, end };
    }

    useEffect(() => {
        const { start, end } = getDataRange(dateData);
        setFromDate(start);
        setToDate(end)
    }, [dateData])



    const [range, setRange] = useState<any>([{ startDate: fromDate, endDate: toDate, key: 'selection' }])

    return (
        <div className='w-full bg-white border rounded-xl shadow p-6'>
            {/* <div className='w-full flex flex-row justify-between'>
                <div className='flex flex-col'>Vendor Statement For Mr. Jay Shah
                    <span className='text-sm'>From {formatDate(fromDate)} To {formatDate(toDate)}</span>
                </div>
                <div className="relative inline-block">
                    <select
                        name="selectData"
                        value={dateData}
                        onChange={(e) => {
                            const value = e.target.value;
                            setDateData(value);
                            setShowCalendar(value === 'Custom');
                        }}
                        onClick={() => {
                            if (dateData === 'Custom') {
                                setShowCalendar(true);
                            }
                        }}
                        className="block w-auto rounded-lg border bg-white focus:outline-none border-gray-300 py-1 px-2 text-gray-900 focus:border-red-500 focus:ring-1 focus:ring-red-300 text-sm"
                    >
                        {dropdown.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                 
                </div>
            </div>
            {showCalendar && (
                <div
                    ref={dropdownRef}
                    className="fixed right-[90px] z-50 bg-white shadow-xl border rounded-md"
                >
                    <div className="flex justify-between px-4 pt-3 pb-1 text-sm font-medium text-gray-700">
                        <span>From: {formatDate(range[0].startDate)}</span>
                        <span>To: {formatDate(range[0].endDate)}</span>
                    </div>
                    <DateRange
                        editableDateInputs
                        onChange={(item) => {
                            const selection = item.selection;
                            setRange([selection]);
                        }}
                        moveRangeOnFirstSelection={false}
                        ranges={range}
                        months={2}
                        direction="horizontal"
                        rangeColors={[`${Colors.red}`]}
                    />
                    <div className="flex justify-end gap-2 p-3">
                        <button
                            onClick={() => {
                                setFromDate(range[0].startDate);
                                setToDate(range[0].endDate);
                                setShowCalendar(false);
                            }}
                            className={`bg-[${Colors.red}] text-white px-4 py-1 rounded hover:bg-red-600 text-sm`}
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => setShowCalendar(false)}
                            className="border border-gray-300 px-4 py-1 rounded text-sm text-gray-700 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )} */}
            <div className='w-full flex flex-row justify-between items-start'>
                <div className='flex flex-col'>
                    Vendor Statement For Mr. Jay Shah
                    <span className='text-sm'>From {formatDate(fromDate)} To {formatDate(toDate)}</span>
                </div>

                <div className="relative flex items-start justify-end gap-2" ref={dropdownContainerRef}>
                    {showCalendar && (
                        <div className="absolute right-[200px] top-0 z-50 bg-white shadow-xl border rounded-md">
                            <div className="flex justify-between px-4 pt-3 pb-1 text-sm font-medium text-gray-700">
                                <span>From: {formatDate(range[0].startDate)}</span>
                                <span>To: {formatDate(range[0].endDate)}</span>
                            </div>
                            <DateRange
                                editableDateInputs
                                onChange={(item) => {
                                    const selection = item.selection;
                                    setRange([selection]);
                                }}
                                moveRangeOnFirstSelection={false}
                                ranges={range}
                                months={2}
                                direction="horizontal"
                                rangeColors={[`${Colors.red}`]}
                            />
                            <div className="flex justify-end gap-2 p-3">
                                <button
                                    onClick={() => {
                                        setFromDate(range[0].startDate);
                                        setToDate(range[0].endDate);
                                        setShowCalendar(false);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={`bg-[${Colors.red}] text-white px-4 py-1 rounded hover:bg-red-600 text-sm`}
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCalendar(false)
                                        setIsDropdownOpen(false);
                                    }}
                                    className="border border-gray-300 px-4 py-1 rounded text-sm text-gray-700 hover:text-gray-900"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => {
                                setIsDropdownOpen(!isDropdownOpen)
                                if(dateData === 'Custom')
                                {
                                    setShowCalendar(true)
                                }
                            }}
                            className="inline-flex justify-between w-48 rounded-lg border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-red-300 focus:border-red-500"
                        >
                            {dateData}
                            <svg
                                className="w-4 h-4 ml-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1 text-sm">
                                    {dropdown.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setDateData(option);
                                                if (option !== 'Custom') {
                                                    setIsDropdownOpen(false);
                                                }
                                                setShowCalendar(option === 'Custom');
                                            }}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${dateData === option ? 'bg-gray-100 font-medium text-red-500' : 'text-gray-700'
                                                }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <hr className='my-3' />
            <div className='w-full flex flex-col mb-3'>
                <span className='text-sm font-bold'>Vaistra Technologies</span>
                <span className='text-sm'>Gujarat, India</span>
                <span className='text-sm'>vaistratechnologies@gmail.com</span>
            </div>
            <div className='grid grid-cols-2 text-sm'>
                <div className='p-2 text-sm flex flex-col'>
                    <span>To</span>
                    <span className='font-bold'>Mr. Jay Shah</span>
                </div>
                <div className='p-2 border-l space-y-2'>
                    <div className='flex justify-between text-sm text-gray-800'>
                        <div>Opening Balance</div>
                        <div>₹ 0.00</div>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <div>Billed Amount</div>
                        <div>₹ 800.00</div>
                    </div>
                    <div className='flex justify-between text-sm'>
                        <div>Amount Paid</div>
                        <div>₹ 530.00</div>
                    </div>
                    <div className='flex justify-between text-sm bg-gray-50 py-2'>
                        <div className='font-bold'>Balance Due</div>
                        <div>₹ 270.00</div>
                    </div>
                </div>
            </div>
            <div className='py-1 mt-3'>
                {/* <table className='w-full text-sm table-auto'>
                    <thead>
                        <tr className='text-gray-600 bg-gray-100'>
                            <th className='px-2 py-2'>Date</th>
                            <th className='px-2 py-2'>Transaction</th>
                            <th className='px-2 py-2'>Details</th>
                            <th className='px-2 py-2 text-right'>Amount</th>
                            <th className='px-2 py-2 text-right'>Payments</th>
                            <th className='px-2 py-2 text-right'>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {filteredData.length > 0 ? (
                            filteredData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <td className="px-2 py-2">{row.date}</td>
                                    <td className="px-2 py-2">{row.transaction}</td>
                                    <td className="px-2 py-2">{row.details}</td>
                                    <td className="px-2 py-2 text-right">{row.amount}</td>
                                    <td className="px-2 py-2 text-right">{row.payments}</td>
                                    <td className="px-2 py-2 text-right">{row.balance}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center bg-gray-50  text-gray-500 italic"
                                >
                                    <div className="flex flex-col items-center justify-center py-6 w-full rounded-full">
                                        <Image
                                            src={noDataFound}
                                            alt="No Data Found"
                                            width={300}
                                            height={300}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table> */}
                <table className="w-full text-sm table-auto border border-gray-200 rounded-xl overflow-hidden">
                    <thead>
                        <tr className="text-gray-600 bg-gray-100">
                            <th className="px-2 py-2 text-left">Date</th>
                            <th className="px-2 py-2 text-left">Transaction</th>
                            <th className="px-2 py-2 text-left">Details</th>
                            <th className="px-2 py-2 text-right">Amount</th>
                            <th className="px-2 py-2 text-right">Payments</th>
                            <th className="px-2 py-2 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((row, index) => (
                                <tr
                                    key={index}
                                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <td className="px-2 py-2">{row.date}</td>
                                    <td className="px-2 py-2">{row.transaction}</td>
                                    <td className="px-2 py-2">{row.details}</td>
                                    <td className="px-2 py-2 text-right">{row.amount}</td>
                                    <td className="px-2 py-2 text-right">{row.payments}</td>
                                    <td className="px-2 py-2 text-right">{row.balance}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="text-center bg-gray-50 text-gray-500 italic"
                                >
                                    <div className="flex flex-col items-center justify-center py-6 w-full">
                                        <Image
                                            src={noDataFound}
                                            alt="No Data Found"
                                            width={300}
                                            height={300}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>
        </div>
    )
}

export default StateMent