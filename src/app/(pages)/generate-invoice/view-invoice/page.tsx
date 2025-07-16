'use client'
import { InvoiceDetails } from '@/app/types/invoice'
import React, { FC, useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getCompanyById } from '../../dashboard-page/dashboard';
import { CompanyData } from '../../../organization/main-dashboard/company-list';
import { toast } from 'react-toastify';
import Loader from '@/app/component/Loader/page';
import Layout from '@/app/component/layout';
import { useSearchParams } from 'next/navigation';
import { getAllInvoiceById, InvoiceData } from '../generate-invoice';
import { getGSTCodeByStateName, StateWithGSTCode } from '@/app/constants/gst_code';


const PreviewInvoice: FC<any> = ({ invoiceData }) => {

    const invoiceRef = useRef<HTMLDivElement>(null);
    const [companyData, setCompanyData] = useState<CompanyData>();
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const id = searchParams.get('id') ?? '';
    const [data, setData] = useState<InvoiceData>();
    const items = data?.items ?? [];
    const [isOutOfGujarat, setIsOutOfGujarat] = useState(false)
    // const handleDownload = async () => {
    //     const html2pdf = (await import('html2pdf.js')).default;

    //     const element = invoiceRef.current;
    //     if (!element) return;

    //     const opt = {
    //         margin: 0,
    //         filename: 'invoice.pdf',
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
    //     };

    //     html2pdf().from(element).set(opt).save();
    // };

    const handleDownload = async () => {
        const html2pdf = (await import('html2pdf.js')).default;

        const element = invoiceRef.current;
        if (!element) return;

        // Ensure page is scrolled to top for proper rendering
        window.scrollTo(0, 0);

        // Optional: Wait for all images to load before rendering
        const preloadImages = () =>
            new Promise((resolve) => {
                const images = element.querySelectorAll('img');
                let loadedCount = 0;
                if (images.length === 0) return resolve(true);

                images.forEach((img) => {
                    if (img.complete) {
                        loadedCount++;
                        if (loadedCount === images.length) resolve(true);
                    } else {
                        img.onload = () => {
                            loadedCount++;
                            if (loadedCount === images.length) resolve(true);
                        };
                        img.onerror = () => {
                            loadedCount++;
                            if (loadedCount === images.length) resolve(true);
                        };
                    }
                });
            });

        await preloadImages();

        const opt = {
            margin: 0,
            filename: 'invoice.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true, // Enable CORS for image loading
            },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        };

        html2pdf().set(opt).from(element).save();
    };

    const hasRCM = items.some(item => item.product.unit === 'RCM');

    const handleDownloadPDF = async () => {
        const element = invoiceRef.current;
        if (!element) return; // ✅ null check

        await new Promise((resolve) => setTimeout(resolve, 500));

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true,
            scrollY: -window.scrollY,
        });


        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'pt', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const ratio = imgWidth / imgHeight;
        const finalImgHeight = pdfWidth / ratio;

        let position = 0;
        if (finalImgHeight > pdfHeight) {
            while (position < finalImgHeight) {
                pdf.addImage(
                    imgData,
                    'PNG',
                    0,
                    position * -1,
                    pdfWidth,
                    finalImgHeight
                );
                position += pdfHeight;

                if (position < finalImgHeight) {
                    pdf.addPage();
                }
            }
        } else {
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalImgHeight);
        }

        pdf.save('invoice.pdf');
    };

    useEffect(() => {
        getCompanyDetails();
        if (id !== '') {
            getInvoiceDetails();
        }
    }, [])

    const getInvoiceDetails = async () => {
        try {
            let response = await getAllInvoiceById({ id: id });
            if (response.success) {
                setData(response.data);
                let isOutOfGT = response.data.customer.placeOfSupplyStateName !== 'Gujarat';
                setIsOutOfGujarat(isOutOfGT);
            }
            else {
                toast.error(`🤔 Failed to get invoice details`, { autoClose: 2000 });
            }
        }
        catch { }
        finally { }
    }

    const getCompanyDetails = async () => {
        setIsLoading(true);
        const id = localStorage.getItem('selectedCompanyId');

        if (!id) {
            throw new Error("Company ID is missing in localStorage");
        }
        try {
            let response = await getCompanyById(id);
            if (response.success) {
                setCompanyData(response.data)
            } else {
                toast.error(`🤔 Data Not Found`, { autoClose: 2000 });
            }
        }
        catch {
            toast.error('Company Data Not Found!');
        }
        finally {
            setIsLoading(false);
        }
    }

    const totalGstTaxAmount = (Number(data?.totalCgst) || 0) + (Number(data?.totalSgst) || 0);
    // const numberToWords = (num: number): string => {
    //     const a = [
    //         '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    //         'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    //         'Seventeen', 'Eighteen', 'Nineteen'
    //     ];

    //     const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    //     const inWords = (n: number): string => {
    //         if (n < 20) return a[n];
    //         if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
    //         if (n < 1000) return `${a[Math.floor(n / 100)]} Hundred ${inWords(n % 100)}`.trim();
    //         if (n < 100000) return `${inWords(Math.floor(n / 1000))} Thousand ${inWords(n % 1000)}`.trim();
    //         if (n < 10000000) return `${inWords(Math.floor(n / 100000))} Lakh ${inWords(n % 100000)}`.trim();
    //         return `${inWords(Math.floor(n / 10000000))} Crore ${inWords(n % 10000000)}`.trim();
    //     };

    //     return inWords(Math.floor(num)).trim() + ' Rupees';
    // };

    const numberToWords = (amount: number): string => {
        if (isNaN(amount) || amount == null) return 'Zero Rupees';

        const a = [
            '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
            'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
            'Seventeen', 'Eighteen', 'Nineteen'
        ];

        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const inWords = (n: number): string => {
            if (n === 0) return 'Zero';
            if (n < 20) return a[n];
            if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
            if (n < 1000) return `${a[Math.floor(n / 100)]} Hundred ${inWords(n % 100)}`.trim();
            if (n < 100000) return `${inWords(Math.floor(n / 1000))} Thousand ${inWords(n % 1000)}`.trim();
            if (n < 10000000) return `${inWords(Math.floor(n / 100000))} Lakh ${inWords(n % 100000)}`.trim();
            return `${inWords(Math.floor(n / 10000000))} Crore ${inWords(n % 10000000)}`.trim();
        };

        const rupees = Math.floor(amount);
        const paise = Math.round((amount - rupees) * 100);

        let result = '';

        if (rupees > 0) {
            result += `${inWords(rupees)} Rupee${rupees > 1 ? 's' : ''}`;
        }

        if (paise > 0) {
            if (result) result += ' and ';
            result += `${inWords(paise)} Paise`;
        }

        return result || 'Zero Rupees';
    };

    const totalTaxAmount = (Number(data?.totalCgst) || 0) + (Number(data?.totalSgst) || 0);
    const totalTaxInWords = numberToWords(totalTaxAmount);
    const totalAmountInWords = numberToWords(data?.grandTotal ?? 0)

    const gstGroupedTotals = data?.items?.reduce((acc, row) => {
        let gst = parseFloat(row.product.gstPercent.replace('%', '') || '0');
        if (isNaN(gst)) gst = 0;
        console.log("GST PERCENTAGE = ", gst)
        if (!acc[gst]) {
            // acc[gst] = {
            //     taxableAmount: 0,
            //     cgstPercent: gst / 2,
            //     sgstPercent: gst / 2,
            //     cgstAmount: 0,
            //     sgstAmount: 0,
            // };

            acc[gst] = {
                taxableAmount: 0,
                cgstPercent: isOutOfGujarat ? 0 : gst / 2,
                sgstPercent: isOutOfGujarat ? 0 : gst / 2,
                igstPercent: isOutOfGujarat ? gst : 0,
                cgstAmount: 0,
                sgstAmount: 0,
                igstAmount: 0
            }
        }

        const taxable = row.taxableAmount || 0;
        acc[gst].taxableAmount += taxable;

        if (isOutOfGujarat) {
            acc[gst].igstAmount += (taxable * gst) / 100;
        }
        else {
            acc[gst].cgstAmount += (taxable * (gst / 2)) / 100;
            acc[gst].sgstAmount += (taxable * (gst / 2)) / 100;
        }

        return acc;
    }, {} as Record<number, {
        taxableAmount: number,
        cgstPercent: number,
        sgstPercent: number,
        igstPercent: number;
        cgstAmount: number,
        sgstAmount: number,
        igstAmount: number,
    }>);

    if (gstGroupedTotals) {
        for (const key in gstGroupedTotals) {
            const group = gstGroupedTotals[Number(key)];
            group.cgstAmount = (group.taxableAmount * group.cgstPercent) / 100;
            group.sgstAmount = (group.taxableAmount * group.sgstPercent) / 100;
            group.igstAmount = (group.taxableAmount * group.igstPercent) / 100;
        }

        const finalTotal = Object.values(gstGroupedTotals).reduce(
            (sum, group) => sum + group.taxableAmount + group.cgstAmount + group.sgstAmount + group.igstAmount,
            0
        );

        console.log("Final total:", finalTotal);
    }

    function formatDate(dateString: string): string {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
    }




    return (
        // <div className='w-full flex flex-col  items-center '>
        //     <div ref={invoiceRef} className='w-full flex flex-col  items-center my-5'>
        //     <div  className='w-[95%] border rounded-md items-start bg-white mb-5'>
        //         {/* <h2 className="text-xl font-bold mb-4 text-center">Tax Invoice</h2> */}
        //         <div className='flex items-stretch justify-between gap-5'>
        //             <div className="w-1/3 flex justify-center items-center">
        //                 <img
        //                     src={`${window.location.origin}/globe.svg`}
        //                     alt="Company Logo"
        //                     className="h-20 w-auto object-contain"
        //                 />
        //             </div>
        //             <div className="w-2/3 border-l border-gray-300 p-5">
        //                 <h1 className='text-2xl font-bold'>Vaistra Technologies</h1>
        //                 <p>Address, City, State - Pincode</p>
        //                 <p><strong>GSTIN:</strong> Gst No</p>
        //                 <p><strong>PAN:</strong></p>
        //             </div>
        //         </div>
        //         <hr />
        //         <div className='w-full justify-between px-2 flex'>
        //             <label className='font-bold text-xl'></label>
        //             <label className='font-bold text-xl'>Tax Invoice</label>
        //             <label className='font-bold text-xl'>Original</label>
        //         </div>
        //         <hr />
        //         <div className='flex items-stretch justify-between'>
        //             <div className='w-2/3  border-r p-5'>
        //                 <h1 className="font-semibold underline">Billed to / Shipped To Address</h1>
        //                 <p><strong>Name:</strong> AJAYSHIN PANWAR</p>
        //                 <p><strong>Address: </strong> railway station</p>
        //                 <p>Porbandar</p>
        //                 <p><strong>Phone No:</strong> 8792372436</p>
        //             </div>
        //             <div className="w-1/3">
        //                 <div className='h-[50%] p-5'>
        //                     <div><strong>Invoice No:</strong> GSTIN1237</div>
        //                     <div><strong>Date:</strong> 08/04/2025</div>
        //                 </div>
        //                 <hr />
        //                 <div className='h-[50%] p-5'>
        //                     <div><strong>Payment Mode:</strong> UPI</div>
        //                 </div>
        //             </div>

        //         </div>
        //         <table className="w-full border text-sm ">
        //             <thead className="bg-gray-100">
        //                 <tr>
        //                     <th className="border px-2 py-1 text-center">#</th>
        //                     <th className="border px-2 py-1 text-center">Product Name</th>
        //                     <th className="border px-2 py-1 text-center">HSN/SAC Code</th>
        //                     <th className="border px-2 py-1 text-center">Qty</th>
        //                     <th className="border px-2 py-1 text-center">Rate</th>
        //                     <th className="border px-2 py-1 text-center">Taxable Value</th>
        //                     <th className="border px-2 py-1 text-center">GST (%)</th>
        //                     <th className="border px-2 py-1 text-center">CGST</th>
        //                     <th className="border px-2 py-1 text-center">SGST</th>
        //                     <th className='border px-2 py-1 text-center'>Net Amount</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 <tr>
        //                     <td className="border px-2 py-1 text-center">1</td>
        //                     <td className="border px-2 py-1">Apple 13" Macbook</td>
        //                     <td className="border px-2 py-1 text-right">847130</td>
        //                     <td className="border px-2 py-1 text-center">1</td>
        //                     <td className="border px-2 py-1 text-right">6864407</td>
        //                     <td className="border px-2 py-1 text-right">6864406</td>
        //                     <td className="border px-2 py-1 text-center">11%</td>
        //                     <td className="border px-2 py-1 text-right">6177.97</td>
        //                     <td className="border px-2 py-1 text-right">6177.97</td>
        //                     <td className="border px-2 py-1 text-right">81000.00</td>
        //                 </tr>
        //             </tbody>
        //             {/* <tbody>
        //                 {data.items.map((item, idx) => {
        //                     const taxable = item.quantity * item.price;
        //                     const tax = taxable * 0.18;
        //                     const total = taxable + tax;
        //                     return (
        //                         <tr key={idx}>
        //                             <td className="border px-2 py-1 text-center">{idx + 1}</td>
        //                             <td className="border px-2 py-1">{item.description}</td>
        //                             <td className="border px-2 py-1">{item.hsn || ''}</td>
        //                             <td className="border px-2 py-1 text-center">{item.quantity}</td>
        //                             <td className="border px-2 py-1 text-right">{item.price}</td>
        //                             <td className="border px-2 py-1 text-right">{taxable.toFixed(2)}</td>
        //                             <td className="border px-2 py-1 text-center">18%</td>
        //                             <td className="border px-2 py-1 text-right">{tax.toFixed(2)}</td>
        //                             <td className="border px-2 py-1 text-right">{total.toFixed(2)}</td>
        //                         </tr>
        //                     );
        //                 })}
        //             </tbody> */}
        //         </table>
        //         <div className="grid grid-cols-3 border">
        //             <div className="col-span-2 border-r">
        //                 <div className='px-5 py-2'>
        //                     <div><strong>Bill Amount (in words):</strong> Eightly Seven Thousand Nine Hundred Only</div>
        //                     <div><strong>GST Amount (in words):</strong> Thirty Thousand Four Hundred Eight</div>
        //                 </div>
        //                 <hr/>
        //                 <div className='px-5 py-2'>
        //                     <div><strong>Bank Name:</strong> HDFC BANK LIMITED</div>
        //                     <div><strong>Bank A/c No:</strong> 50200042187917</div>
        //                     <div><strong>RTGS/IFSC Code:</strong> HDC0000274</div>
        //                 </div>
        //             </div>
        //             <div className="col-span-1 py-2">
        //                 <div className='px-5'>
        //                     <div className="flex justify-between"><strong>Total Taxable value:</strong><strong>74491.52</strong></div>
        //                     <div className="flex justify-between"><label>CGST</label>6704.24</div>
        //                     <div className="flex justify-between"><label>SGST</label>6704.24</div>
        //                 </div>
        //                 <hr />
        //                 <div className='px-5 py-2'>
        //                     <div className="flex justify-between"><strong>Total Invoice Value:</strong><strong>87900.00</strong></div>
        //                 </div>
        //             </div>
        //         </div>
        //         <hr />
        //         <div className="flex justify-between px-5 py-3">
        //             <h2 className="font-bold">Terms & Condition :</h2>
        //             <h2 className="font-bold">FOR, INFINITE IT SOLUTIONS & SERVICES</h2>
        //         </div>
        //         <div className='px-5'>
        //             <ol>
        //                 <li>1. Goods Once Sold Will Not Be Accepted.</li>
        //                 <li>2. All Product come with manufacturer's warranty.</li>
        //                 <li>3. Warranty As per their manufacturer's Terms & Conditions.</li>
        //                 <li>4. Physical Damage, Burnt parts or Liquid damage are not covered in warranty.</li>
        //                 <li>5. Any kinds of Software or compibility issues are not covered in warranty.</li>
        //                 <li>6. Goods Remain Property of seller till Completion of full payment.</li>
        //             </ol>
        //         </div>
        //         <div className="flex justify-between items-center px-5 py-3">
        //             <div className="font-semibold">
        //                 Receiver’s Signature :- <span className="border-b border-black inline-block w-48 ml-2" />
        //             </div>
        //             <div className="italic">(Authorised Signatory)</div>
        //         </div>
        //     </div>
        //     </div>
        //     <button onClick={handleDownload} className="my-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Download PDF
        //     </button>
        // </div >
        <div>
            {isLoading ? (
                <div className="flex-grow">
                    <div className="absolute inset-0 flex justify-center items-center">
                        <Loader isInside={true} />
                    </div>
                </div>
            ) : (
                <div className=' p-5'>
                    <div className=" text-black">

                        <div>
                            <div ref={invoiceRef} className="max-w-4xl mx-auto p-6 bg-white ">
                                {/* Header */}
                                <div className='flex items-stretch justify-between border'>
                                    <div className="w-1/3 flex justify-center items-center">
                                        {companyData?.logo === null ?
                                            <img
                                                src='/assets/images/logo.png'
                                                alt="Company Logo"
                                                className="h-10 w-auto object-contain"
                                            />
                                            :
                                            <img
                                                src={companyData?.logo}
                                                //src='/assets/images/logo.png'
                                                alt="Company Logo"
                                                className="h-10 w-auto object-contain"
                                            />}
                                    </div>
                                    <div className="w-2/3 px-3 py-3 border-l border-gray-300 text-sm">
                                        <h1 className='text-xl font-bold'>{companyData?.companyName}</h1>

                                        {companyData?.billingAddress1 ?? ''}, {companyData?.billingAddress2 ?? ''}, {companyData?.billingAddress3 ?? ''} <br />
                                        {companyData?.billingCityName ?? ''}  - {companyData?.billingPincode}<br />
                                        PH NO. 0286- 2265777 <br />
                                        <strong>GSTIN:</strong> {companyData?.gstNumber} <br />
                                        {`${companyData?.billingStateName || ''} (${getGSTCodeByStateName(companyData?.billingStateName?.toString() || '') || 'N/A'})`}
                                    </div>
                                </div>
                                <div className='w-full justify-between px-3 py-1 flex border' >
                                    <label className='font-bold text-xl opacity-0'>Type</label>
                                    <label className='font-bold text-xl'>Tax Invoice</label>
                                    <label className='font-bold text-xl'>Original</label>
                                </div>
                                <div className="grid grid-cols-2 text-sm border border-collapse">
                                    {/* <div className='px-3 py-2'>
                        <p>
                            <span className="font-bold">Invoice #:</span> VTPL425001
                        </p>
                        <p>
                            <span className="font-bold">Invoice Date:</span> 11/04/2025
                        </p>
                        <p>
                            <span className="font-bold">Terms:</span> Due On Receipt
                        </p>
                        <p>
                            <span className="font-bold">Due Date:</span> 11/04/2025
                        </p>
                    </div> */}
                                    <div className='p-3 text-sm'>
                                        <strong>Invoice No: </strong> {data?.invoicePrefix}{data?.invoiceNumber} <br />
                                        <strong>Invoice Date: </strong> {formatDate(data?.invoiceDate || '')} <br />
                                        <strong>Terms: </strong>{data?.terms} <br />
                                        <strong>Due Date: </strong> {formatDate(data?.dueDate || '')}
                                    </div>
                                    <div className="p-3 border-l border-gray-300">
                                        <p>
                                            <span className="font-bold">Place Of Supply:</span> {data?.customer.placeOfSupplyStateName} {`(${getGSTCodeByStateName(data?.customer?.placeOfSupplyStateName?.toString() || '') || 'N/A'})`}
                                        </p>
                                    </div>
                                </div>

                                {/* Billing / Shipping */}
                                <div className="grid grid-cols-2 border-r border-l text-sm ">
                                    <div className="px-3 py-2">
                                        <p className="font-bold mb-1">Bill To</p>
                                        <p>
                                            <span className="font-bold">{data?.customer.billingAttention}</span>
                                            <br />
                                            {data?.customer?.billingAddressLine1 + ' ' + data?.customer.billingAddressLine2}
                                            <br />
                                            {data?.customer.billingCityName}
                                            <br />
                                            {data?.customer.billingStateName + ' ' + data?.customer.billingPincode}
                                            <br />
                                            India
                                        </p>
                                    </div>
                                    <div className="px-3 border-l border-gray-300 py-2">
                                        <p className="font-bold mb-1">Ship To</p>
                                        <p>
                                            <span className="font-bold">{data?.customer.shippingAttention}</span>
                                            <br />
                                            {data?.customer?.shippingAddressLine1 + ' ' + data?.customer.shippingAddressLine2}
                                            <br />
                                            {data?.customer.shippingCityName}
                                            <br />
                                            {data?.customer.shippingStateName + ' ' + data?.customer.shippingPincode}
                                            <br />
                                            India
                                        </p>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="border border-gray-300 overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead className="bg-gray-100">
                                            <tr className="border border-gray-300">
                                                <th className="border p-2 text-center">#</th>
                                                <th className="border p-2 text-center">Item & Description</th>
                                                <th className="border p-2 text-center">HSN / SAC</th>
                                                <th className="border p-2 text-center">Qty</th>
                                                <th className="border p-2 text-center">Unit</th>
                                                <th className="border p-2 text-center">Rate</th>
                                                <th className="border p-2 text-center">GST %</th>
                                                <th className="border p-2 text-left">Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                data?.items.map((item, index) => (
                                                    <tr className='borde border-gray-300' key={index}>
                                                        <td className="p-2 border-r "> {index + 1}</td>
                                                        <td className="p-2 border-r">{item.product.productName}</td>
                                                        <td className="p-2 border-r text-center">{item.product.hsnCode == null ? item.product.sacCode : item.product.hsnCode}</td>
                                                        <td className="p-2 border-r text-right">{item.quantity}</td>
                                                        <td className="p-2 border-r text-center">{item.product.unit}</td>
                                                        <td className="p-2 border-r text-right">{item.rate.toLocaleString('en-In', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                        <td className="p-2 border-r text-right">{item.product.gstPercent}</td>
                                                        <td className="p-2 border-r text-right">{item.taxableAmount.toLocaleString('en-In', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    </tr>
                                                ))
                                            }
                                            {Array.from({ length: Math.max(0, ((data?.otherCharge?.length ?? 0) > 0 ? 5 : 6) - items.length) }).map((_, i) => (
                                                <tr className=" border-gray-300" key={`empty-${i}`}>
                                                    <td className="p-2 border-r text-center">&nbsp;</td>
                                                    <td className="p-2 border-r">&nbsp;</td>
                                                    <td className="p-2 border-r">&nbsp;</td>
                                                    <td className="p-2 border-r">&nbsp;</td>
                                                    <td className="p-2 border-r">&nbsp;</td>
                                                    <td className="p-2 border-r">&nbsp;</td>
                                                    <td className="p-2 border-r">&nbsp;</td>
                                                    <td className="p-2 border-r">&nbsp;</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="grid grid-cols-3 text-sm">
                                    <div className="col-span-2 border-r border-l px-3 py-1">
                                        {/* GSTIN NO.: {companyData?.gstNumber} */}
                                    </div>
                                    <div className="col-span-1 border-r  overflow-x-auto">
                                        <div className="flex justify-between text-sm px-3 py-1">
                                            <div className='font-bold'>Sub Total</div>
                                            {/* <div>{Math.round(finalTotal - 0.5) === finalTotal ? '₹ 0.00' : (finalTotal - Math.round(finalTotal)).toFixed(2)}</div> */}
                                            <div className='font-bold'>{data?.totalTaxableAmount.toLocaleString('en-In', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 text-sm">
                                    <div className="col-span-2 border">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-100 border-b">
                                                <tr>

                                                    <th className="p-2 text-sm"> </th>
                                                    <th className="p-2 text-center text-sm" colSpan={2}>Central</th>
                                                    <th className="p-2 text-center text-sm" colSpan={2}>State/UT</th>
                                                    <th className='p-2 text-center text-sm' colSpan={2}>Integrated</th>
                                                </tr>
                                                <tr>

                                                    <th className="p-2 text-sm">Amount</th>
                                                    <th className="p-2 text-sm">Rate</th>
                                                    <th className="p-2 text-sm">Amount</th>
                                                    <th className="p-2 text-sm">Rate</th>
                                                    <th className="p-2 text-sm">Amount</th>
                                                    <th className='p-2 text-sm'>Rate</th>
                                                    <th className='p-2 text-sm'>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(gstGroupedTotals ?? {}).map(([gstRate, datas]) => (
                                                    <tr key={gstRate}>
                                                        <td className="p-2 text-sm">{datas.taxableAmount.toFixed(2)}</td>
                                                        <td className="p-2 text-sm">{datas.cgstPercent}%</td>
                                                        <td className="p-2 text-sm">{datas.cgstAmount.toFixed(2)}</td>
                                                        <td className="p-2 text-sm">{datas.sgstPercent}%</td>
                                                        <td className="p-2 text-sm">{datas.sgstAmount.toFixed(2)}</td>
                                                        <td className='p-2 text-sm'>{datas.igstPercent}%</td>
                                                        <td className='p-2 text-sm'>{datas.igstAmount.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Right Side Summary (1/3 width) */}
                                    <div className="col-span-1 border border-gray-300 p-3  overflow-x-auto">
                                        <div className="flex justify-between text-sm text-gray-800">
                                            <h4 className="text-sm font-semibold mb-2 text-gray-700">Taxable Amount:</h4>
                                            {/* <div>₹ {Object.values(gstGroupedTotals).reduce((sum, data) => sum + data.taxableAmount, 0).toFixed(2)}</div> */}
                                            <div>
                                                {data?.totalTaxableAmount.toLocaleString('en-In', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-800">
                                            <div>IGST</div>
                                            <div>{data?.totalIgst.toFixed(2)}</div>
                                        </div>
                                        {/* Total CGST Amount */}
                                        <div className="flex justify-between text-sm text-gray-800">
                                            <div>CGST</div>
                                            <div>{data?.totalCgst.toFixed(2)}</div>
                                        </div>

                                        {/* Total SGST Amount */}
                                        <div className="flex justify-between text-sm text-gray-800 mt-1">
                                            <div>SGST</div>
                                            <div>{data?.totalSgst.toFixed(2)}</div>
                                        </div>

                                        <div className="flex justify-between text-sm text-gray-800 mt-2">
                                            <div>Round Off</div>
                                            {/* <div>{Math.round(finalTotal - 0.5) === finalTotal ? '₹ 0.00' : (finalTotal - Math.round(finalTotal)).toFixed(2)}</div> */}
                                            <div>{data?.roundOff.toFixed(2)}</div>
                                        </div>
                                        {
                                            data?.otherCharge !== null && data?.otherCharge.map((charges, index) => (
                                                <div className="flex justify-between text-sm text-gray-800 mt-2" key={index}>
                                                    <div>{charges.label}</div>

                                                    <div>{charges.value}</div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 text-sm">
                                    <div className="col-span-2 border px-3 py-1 space-y-2">
                                        {/* Total GST */}
                                        <div className="">
                                            <p><span className="font-semibold text-sm">Total GST:    </span> {totalTaxInWords}</p>
                                        </div>
                                        <div className="">
                                            <p><span className="font-bold text-sm">Bill Amount:    </span>{totalAmountInWords}</p>
                                        </div>
                                    </div>
                                    <div className="border border-gray-300 col-span-1 py-1 px-3  overflow-x-auto">
                                        <div className="flex justify-between text-sm text-gray-800">
                                            <div className='font-bold'>Grand Total</div>
                                            {/* <div>{Math.round(finalTotal - 0.5) === finalTotal ? '₹ 0.00' : (finalTotal - Math.round(finalTotal)).toFixed(2)}</div> */}
                                            <div className='font-bold'>{data?.grandTotal.toLocaleString('en-In', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-8 px-3 py-1 leading-relaxed text-sm border-l border-r  min-h-[5rem]">
                                    <p className="font-semibold mb-1 text-sm">Narration :</p>

                                    {
                                        data?.narration
                                    }
                                    <br />
                                </div>
                                <div className="grid grid-cols-12 border text-xs">
                                    {/* Terms and Conditions */}
                                    <div className="col-span-8 px-3 py-1 leading-relaxed min-h-[8rem]">
                                        <p className="font-semibold underline mb-1">Terms & Conditions :</p>
                                        {data?.customer.terms}
                                        <br />
                                    </div>

                                    {/* Right side with fixed footer */}
                                    <div className="col-span-4 p-2 flex flex-col justify-between min-h-[8rem] text-right">
                                        <div className="font-semibold">For, <span className="font-bold">Vaistra Technology</span></div>

                                        <div className="mt-10">
                                            <p>Authorized Signature</p>
                                            <div className="border-t w-40 ml-auto"></div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className='text-center'>
                                <button onClick={handleDownloadPDF} className="my-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Download PDF
                                </button>
                            </div>
                        </div>


                    </div>

                </div>
            )}
        </div>
    )
}

export default PreviewInvoice