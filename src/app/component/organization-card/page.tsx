'use client';
import { useRouter } from 'next/navigation';
import { FaBuilding } from 'react-icons/fa';
import { MoreVertical } from 'lucide-react';
import Colors from '@/app/utils/colors';
import CustomButton from '../buttons/page';
import { CompanyData } from '@/app/organization/main-dashboard/company-list';
import { useEffect, useRef, useState } from 'react';
import { GoSync } from 'react-icons/go';
import Image from 'next/image'
import { toast } from 'react-toastify';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [pendingAction, setPendingAction] = useState<'edit' | 'delete' | 'go' | null>(null);

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

    // const handleVerifyPassword = () => {
    //     if(password === '')
    //     {
    //         alert("Please enter password for verification");
    //     }
    //     else if (password === '123456') {
    //         setIsPasswordCorrect(true);
    //         setIsModalOpen(false);
    //         localStorage.setItem('selectedCompanyId', data.companyId.toString());
    //         router.replace(`/dashboard-page?companyId=${data.companyId}`);
    //     } else {
    //         alert('Incorrect password');
    //     }
    // };

    const handleVerifyPassword = () => {
        if (password === '') {
            alert("Please enter password for verification");
            return false;
        } else if (password === data.password) {
            setIsPasswordCorrect(true);
            setIsModalOpen(false);
            localStorage.setItem('selectedCompanyId', data.companyId.toString());

            // Perform the intended action
            if (pendingAction === 'go') {
                router.replace(`/dashboard-page?companyId=${data.companyId}`);
                toast.success('Password verify successfully!')
            } else if (pendingAction === 'edit' && onEditClick) {
                onEditClick();
            } else if (pendingAction === 'delete' && onDeleteClick) {
                onDeleteClick();
            }

            setPendingAction(null);
            return true;
        } else {
            alert('Incorrect password');
            return false;
        }
    };

    return (
        // <div className="relative w-full bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
        //     <div className="flex justify-between items-start">
        //         <div className="flex items-center gap-4">
        //             <div className="bg-gray-100 p-4 rounded-lg">
        //                 <FaBuilding className="text-gray-600" size={32} />
        //             </div>
        //             <div>
        //                 <h3 className="text-lg font-semibold text-gray-800 font-inter">{data.companyName}</h3>
        //                 <p className="text-sm text-gray-600"><span className="font-medium">Organization ID:</span> {data.companyId}</p>
        //                 <p className="text-sm text-gray-600"><span className="font-medium">Owner:</span> {data.ownerName}</p>
        //                 <p className="text-sm text-gray-600"><span className="font-medium">Industry:</span> {data.industry}</p>
        //                 <p className="text-sm text-gray-600"><span className="font-medium">GST:</span> {data.gstNumber}</p>
        //                 <p className="text-xs text-gray-500">Created on {new Date(data.createdAt).toLocaleDateString()}</p>
        //             </div>
        //         </div>

        //         <div className="relative">
        //             <button
        //                 ref={buttonRef}
        //                 onClick={handleToggleMenu}
        //                 className="text-gray-500 hover:text-gray-700"
        //             >
        //                 <MoreVertical size={18} />
        //             </button>

        //             {menuOpen && !isDeleted && (
        //                 <div
        //                     ref={menuRef}
        //                     className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10"
        //                 >
        //                     <button
        //                         className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        //                         // onClick={onEditClick}
        //                         onClick={() => {
        //                             setOpenMenuId(null);
        //                             setPendingAction('edit');
        //                             setIsModalOpen(true);
        //                         }}
        //                     >
        //                         <img src="/assets/icons/edit.png" alt="Edit" className="w-4 h-4 grayscale" />
        //                         <span>Edit</span>
        //                     </button>
        //                     <button
        //                         className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        //                         // onClick={onDeleteClick}
        //                         onClick={() => {
        //                             setOpenMenuId(null);
        //                             setPendingAction('delete');
        //                             setIsModalOpen(true);
        //                         }}
        //                     >
        //                         <img src="/assets/icons/delete.png" alt="Delete" className="w-4 h-4 grayscale" />
        //                         <span>Delete</span>
        //                     </button>
        //                 </div>
        //             )}
        //             {
        //                 menuOpen && isDeleted && (
        //                     <div
        //                         ref={menuRef}
        //                         className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10"
        //                     >
        //                         <button
        //                             className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
        //                             onClick={onRestoreClick}
        //                         >
        //                             <GoSync size={14} color={Colors.labelColor} />
        //                             <span>Restore</span>
        //                         </button>

        //                     </div>
        //                 )
        //             }
        //         </div>
        //     </div>

        //     <div className="mt-4 text-right">
        //         {!isDeleted && <CustomButton
        //             name="Go to Organization"
        //             className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter"
        //             style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
        //             // onClick={() => {
        //             //     localStorage.setItem('selectedCompanyId', data.companyId.toString());
        //             //     router.replace(`/dashboard-page?companyId=${data.companyId}`);
        //             // }}
        //             onClick={() => {
        //                 setPendingAction('go');
        //                 setIsModalOpen(true);
        //             }}
        //         />}
        //     </div>

        //     {/* Modal for Password Verification */}
        //     {isModalOpen && (
        //         <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
        //             <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        //                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Password Verification</h3>
        //                 <div className="relative mb-4">
        //                     <input
        //                         id="password"
        //                         type={showPassword ? 'text' : 'password'}
        //                         value={password}
        //                         onChange={(e) => setPassword(e.target.value)}
        //                         className="w-full px-3 py-1.5 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-300 pr-10"
        //                         style={{
        //                             border: `1px solid ${Colors.borderColor}`,
        //                         }}
        //                     />
        //                     <button
        //                         type="button"
        //                         className="absolute top-1/2 right-3 -translate-y-1/2"
        //                         onClick={() => setShowPassword(!showPassword)}
        //                         tabIndex={-1}
        //                     >
        //                         <Image
        //                             src={showPassword ? '/assets/images/hide.svg' : '/assets/images/show.svg'}
        //                             alt={showPassword ? 'Hide password' : 'Show password'}
        //                             width={18}
        //                             height={18}
        //                         />
        //                     </button>
        //                 </div>
        //                 <div className="flex justify-end gap-4">
        //                     <button
        //                         onClick={() => {
        //                             setPassword('');
        //                             setIsModalOpen(false)}} // Close the modal without verification
        //                         className="text-gray-500 hover:text-gray-700"
        //                     >
        //                         Cancel
        //                     </button>
        //                     <button
        //                         onClick={handleVerifyPassword} // Verify the password
        //                         className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inte" style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
        //                     >
        //                         Verify
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>
        //     )}
        // </div>


        <div className="relative w-full bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all overflow-hidden">
            <div className="flex  justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <FaBuilding className="text-gray-600" size={32} />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-800 font-inter">{data.companyName}</h3>
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
                                onClick={() => {
                                    setOpenMenuId(null);
                                    setPendingAction('edit');
                                    setIsModalOpen(true);
                                }}
                            >
                                <img src="/assets/icons/edit.png" alt="Edit" className="w-4 h-4 grayscale" />
                                <span>Edit</span>
                            </button>
                            <button
                                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => {
                                    setOpenMenuId(null);
                                    setPendingAction('delete');
                                    setIsModalOpen(true);
                                }}
                            >
                                <img src="/assets/icons/delete.png" alt="Delete" className="w-4 h-4 grayscale" />
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                    {menuOpen && isDeleted && (
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
                    )}
                </div>
            </div>

            <div className="mt-4 text-right">
                {!isDeleted && <CustomButton
                    name="Go to Organization"
                    className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter border-none"
                    style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
                    onClick={() => {
                        setPendingAction('go');
                        setIsModalOpen(true);
                    }}
                />}
            </div>

            {/* Modal for Password Verification */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full z-30">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Password Verification</h3>
                        <div className="relative mb-4">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-1.5 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-red-300 pr-10 text-black"
                                style={{
                                    border: `1px solid ${Colors.borderColor}`,
                                }}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                <Image
                                    src={showPassword ? '/assets/images/hide.svg' : '/assets/images/show.svg'}
                                    alt={showPassword ? 'Hide password' : 'Show password'}
                                    width={18}
                                    height={18}
                                />
                            </button>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setPassword('');
                                    setIsModalOpen(false)
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerifyPassword}
                                className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter"
                                style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}
