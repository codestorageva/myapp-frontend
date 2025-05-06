'use client';
import { useRouter } from 'next/navigation';
import { FaBuilding } from 'react-icons/fa';
import { MoreVertical } from 'lucide-react';
import Colors from '@/app/utils/colors';
import CustomButton from '../buttons/page';
import { CompanyData } from '@/app/(pages)/main-dashboard/company-list';
import { useEffect, useRef, useState } from 'react';
import { GoSync } from 'react-icons/go';

export default function OrganizationCard({
    data,
    openMenuId,
    setOpenMenuId,
    onEditClick,
    onDeleteClick,
    isDeleted = false,
    onRestoreClick,
}: {
    data: CompanyData;
    openMenuId: string | null;
    setOpenMenuId: (id: string | null) => void;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    isDeleted?: boolean;
    onRestoreClick?: () => void;
}) {
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuOpen = openMenuId === data.companyId.toString();

    // ✅ Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setOpenMenuId]);

    const handleToggleMenu = () => {
        setOpenMenuId(menuOpen ? null : data.companyId.toString());
    };

    return (
        <div className="relative bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <FaBuilding className="text-gray-600" size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 font-inter">{data.companyName}</h3>
                        <p className="text-sm text-gray-600"><span className="font-medium">Organization ID:</span> {data.companyId}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Owner:</span> {data.ownerName}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Industry:</span> {data.industry}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">GST:</span> {data.gstNumber}</p>
                        <p className="text-xs text-gray-500">Created on {new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="relative">
                    <button
                        ref={buttonRef}
                        onClick={handleToggleMenu}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <MoreVertical size={18} />
                    </button>

                    {menuOpen && !isDeleted && (
                        <div
                            ref={menuRef}
                            className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10"
                        >
                            <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={onEditClick}
                            >
                                <img src="/assets/icons/edit.png" alt="Edit" className="w-4 h-4 grayscale" />
                                <span>Edit</span>
                            </button>
                            <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={onDeleteClick}
                            >
                                <img src="/assets/icons/delete.png" alt="Delete" className="w-4 h-4 grayscale" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                    {
                        menuOpen && isDeleted && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10"
                            >
                                <button
                                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                    onClick={onRestoreClick}
                                >
                                    <GoSync size={14} color={Colors.labelColor} />
                                    <span>Restore</span>
                                </button>
                                
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="mt-4 text-right">
                {!isDeleted && <CustomButton
                    name="Go to Organization"
                    className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter"
                    style={{ background: Colors.gradient2 }}
                    onClick={() => {
                        localStorage.setItem('selectedCompanyId', data.companyId.toString());
                        router.replace(`/dashboard-page?companyId=${data.companyId}`);
                    }}
                />}
            </div>


        </div>
    );
}
