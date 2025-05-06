'use client'
import Layout from '@/app/component/layout'
import React, { useEffect, useState } from 'react'
import { getCompanyById } from './dashboard';
import { useSearchParams } from 'next/navigation';
import { CompanyData } from '../main-dashboard/company-list';
import Spinner from '@/app/component/spinner';
import Loader from '@/app/component/Loader/page';

const DashboardScreen = () => {
    const searchParams = useSearchParams();
    const companyId = searchParams.get('companyId') ?? '';
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCompanyDetails();
    }, []);

    const getCompanyDetails = async () => {
        try {
            setLoading(true);

            const localCompanyId = localStorage.getItem('selectedCompanyId');
            const finalCompanyId = companyId || localCompanyId;
            if (!finalCompanyId) {
                setError('Company ID is missing.');
                return;
            }

            const res = await getCompanyById(finalCompanyId);
            console.log("===response data", res.data)
            if (res.success) {
                setCompanyData(res.data);
            } else {
                setError('Failed to load company details.');
            }
        } catch (err) {
            setError('An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    };

    // if (loading) {
    //     return (
    //         <Layout>
    //             <div className="flex justify-center items-center h-full">
    //                 <Spinner /> {/* You can replace this with your own loading spinner component */}
    //             </div>
    //         </Layout>
    //     );
    // }

    if (error) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-full">
                    <p className="text-red-600">{error}</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-6 space-y-4">
                {loading && (
                    <Loader isInside={true} />
                )}
                <div className="text-2xl font-bold text-gray-900">{companyData?.companyName}</div>
                <div className="text-lg text-gray-700">
                    <strong>Industry: </strong>{companyData?.industry}
                </div>
            </div>
        </Layout>
    );
};

export default DashboardScreen;
