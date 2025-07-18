'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import NavItems from './nav_item'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { FaPlus } from 'react-icons/fa'
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { FaBuilding } from 'react-icons/fa6'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleUser } from '@fortawesome/free-solid-svg-icons'
import Colors from '../utils/colors'


interface SideNavProps {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const SideNav: React.FC<SideNavProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const [hasMounted, setHasMounted] = useState(false);
    const navItems = NavItems();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [userCollapsed, setUserCollapsed] = useState(false);
    const [expandedMenu, setExpandedMenu] = useState<string[]>([]); // NEW
    const { data } = useSession();
    const router = useRouter();

    useEffect(() => {
        setHasMounted(true);
        const saved = window.localStorage.getItem('sidebarExpanded');
        setIsSidebarExpanded(saved === null ? true : JSON.parse(saved));


        //updated code
        // setHasMounted(true);

        // const savedSidebarState = window.localStorage.getItem('sidebarExpanded');
        // setIsSidebarExpanded(savedSidebarState === null ? true : JSON.parse(savedSidebarState));

        // const savedExpandedMenu = window.localStorage.getItem('expandedMenu');
        // if (savedExpandedMenu) {
        //     try {
        //         setExpandedMenu(JSON.parse(savedExpandedMenu));
        //     } catch (err) {
        //         console.error('Invalid expandedMenu in localStorage');
        //     }
        // }

        // // Set session flag to detect refresh
        // sessionStorage.setItem('isRefreshed', 'true');

        // const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        //     // If sessionStorage has the flag, it's a refresh
        //     const isRefresh = sessionStorage.getItem('isRefreshed');

        //     // If it's NOT a refresh, it's likely a tab close → clear the menu
        //     if (!isRefresh) {
        //         window.localStorage.removeItem('expandedMenu');
        //     }

        //     // Clear session flag for next time
        //     sessionStorage.removeItem('isRefreshed');
        // };

        // window.addEventListener('beforeunload', handleBeforeUnload);

        // return () => {
        //     window.removeEventListener('beforeunload', handleBeforeUnload);
        // };
    }, []);

    useEffect(() => {
        if (hasMounted) {
            window.localStorage.setItem('expandedMenu', JSON.stringify(expandedMenu));
        }
    }, [expandedMenu, hasMounted]);

    const userCollapsedMenu = () => {
        setUserCollapsed((prev) => !prev);
    };

    const toggleSidebar = () => {
        const nextState = !isSidebarExpanded;
        setIsSidebarExpanded(nextState);
        window.localStorage.setItem('sidebarExpanded', JSON.stringify(nextState));
    };

    useEffect(() => {
        if (userCollapsed) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [userCollapsed]);

    if (!hasMounted) return null;

    return (


        <>
            {/*  Overlay when sidebar is open in mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 bg-opacity-40 z-[999] sm:hidden"

                />
            )}

            {/*  Sidebar */}
            <div
                className={cn(
                    'transition-all duration-300 ease-in-out transform m-4 rounded-lg',
                    isSidebarExpanded ? 'w-[250px]' : 'w-[68px]',
                    sidebarOpen
                        ? 'fixed top-0 left-0 h-[calc(98%-1rem)] w-[250px] z-[1000] sm:hidden'
                        : 'hidden sm:flex h-fill'
                )}
                style={{
                    background: 'linear-gradient(to top, #760000 10%, #af0000 60%, #760000 100%)',
                }}
            >
                <aside className="flex h-full flex-col w-full break-words overflow-x-visible columns-1">
                    {/*  Close button (only visible on mobile) */}
                    <div className="flex justify-end p-2 sm:hidden">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-white hover:text-gray-300 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* ✅ Sidebar top nav items */}
                    <div className="mt-4 relative pb-2">
                        <div className="flex flex-col space-y-1">
                            {navItems.map((item, idx) =>
                                item.position === 'top' ? (
                                    <div key={idx} className="space-y-1">
                                        <SideNavItem
                                            label={item.name}
                                            icon={item.icon}
                                            path={item.href}
                                            active={item.active}
                                            isSidebarExpanded={isSidebarExpanded}
                                            children={item.children}
                                            expandedMenu={expandedMenu}
                                            setExpandedMenu={setExpandedMenu}
                                        />
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>

                    {/* ✅ User info and logout */}
                    <div className="sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block">
                        <div
                            className="bg-white flex items-start gap-3 relative mx-3 rounded-bl-xl rounded-tl-md rounded-tr-xl rounded-br-md p-2 mt-1 cursor-pointer"
                            onClick={userCollapsedMenu}
                        >
                            <div className="w-10 h-10 bg-[#760000] flex items-center justify-center text-white font-bold rounded-full overflow-hidden">
                                {data?.user?.fullName?.charAt(0) ?? "S"}
                            </div>
                            <div className="flex flex-col justify-center text-black text-sm text-left">
                                <span className="font-medium">{data?.user?.fullName ?? "User Name"}</span>
                                <span className="text-xs opacity-80 capitalize">
                                    {(data?.user?.roleName ?? "Superadmin").replace("ROLE_", "")}
                                </span>
                            </div>

                            {userCollapsed && (
                                <div className="absolute -top-5 left-full ml-6 w-56 max-h-[calc(100vh-100px)] overflow-y-auto bg-white rounded-xl shadow-lg z-54 mb-5">
                                    <div className="flex flex-col gap-3 text-sm text-gray-700 p-4">
                                        <div
                                            className="flex items-center gap-2 cursor-pointer"
                                            onClick={() => {
                                                localStorage.removeItem('selectedCompanyId');
                                                router.replace('/');
                                            }}
                                        >
                                            <FaBuilding className="text-gray-600" size={20} />
                                            Organizations
                                        </div>

                                        <button
                                            onClick={() => {
                                                const email = localStorage.getItem('savedEmail');
                                                const psw = localStorage.getItem('savedPassword');
                                                localStorage.removeItem('expandedMenu');
                                                sessionStorage.clear();
                                                localStorage.clear();

                                                if (email && psw) {
                                                    localStorage.setItem('savedEmail', email);
                                                    localStorage.setItem('savedPassword', psw);
                                                }

                                                signOut();
                                            }}
                                            className="flex items-center gap-2 text-left hover:text-red-600"
                                        >
                                            <Image src="/assets/icons/logout.png" alt="Logout" width={20} height={20} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}



                        </div>
                    </div>
                </aside>
            </div>
        </>

    );
};

export default SideNav;

interface NavChild {
    name: string;
    href: string;
    icon?: React.ReactNode;
    active: boolean;
    children?: NavChild[];
}



export const SideNavItem: React.FC<{
    label: string;
    icon: any;
    path: string;
    active: boolean;
    isSidebarExpanded: boolean;
    children?: NavChild[];
    expandedMenu: string[];
    setExpandedMenu: React.Dispatch<React.SetStateAction<string[]>>;
    logout?: boolean;
}> = ({
    label,
    icon,
    path,
    active,
    isSidebarExpanded,
    children,
    expandedMenu,
    setExpandedMenu,
    logout = false
}) => {
        const pathname = usePathname();
        const hasChildren = !!children && children.length > 0;
        const hasSubChildren =
            hasChildren && children.some((child) => child.children && child.children.length > 0);
        const router = useRouter();
        const isChildRoute = hasChildren
            ? children.some(
                (child) =>
                    pathname === child.href ||
                    (child.children && child.children.some((subChild) => pathname === subChild.href))
            )
            : false;

        // const isChildRoute = hasChildren
        //     ? children.some(
        //         (child) =>
        //             pathname === child.href ||
        //             (child.children && child.children.some((subChild) => pathname === subChild.href))
        //     )
        //     : pathname.startsWith(path);


        const isExpanded = expandedMenu.includes(label);
        const isActive = active || isChildRoute;

        const hasInitialized = useRef(false);

        useEffect(() => {
            if (hasInitialized.current) return;

            if (isChildRoute) {
                setExpandedMenu((prev) => {
                    const openKeys = [...prev];

                    if (!openKeys.includes(label)) openKeys.push(label);

                    children?.forEach((child, idx) => {
                        if (
                            pathname === child.href ||
                            child.children?.some((subChild) => pathname === subChild.href)
                        ) {
                            const key = `${label}-${idx}`;
                            if (!openKeys.includes(key)) openKeys.push(key);
                        }
                    });

                    return openKeys;
                });

                hasInitialized.current = true;
            }
        }, [pathname, isChildRoute, label, children, setExpandedMenu]);

        const handleToggle = () => {
            setExpandedMenu((prev) =>
                prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
            );

            // setExpandedMenu((prev) =>
            //     prev.includes(label) ? [] : [label]
            // );
        };

        // const itemClass = cn(
        //     "cursor-pointer font-inter relative flex items-center whitespace-nowrap rounded-md text-base transition-all duration-300",
        //     isActive
        //         ? "bg-neutral-200/60 text-neutral-700 dark:bg-neutral-800/60 dark:text-white"
        //         : "text-white hover:bg-white hover:text-black group"
        // );
        const itemClass = cn(
            "cursor-pointer font-inter relative flex items-center whitespace-nowrap text-base transition-all duration-300 mx-3 group",
            isActive
                ? "bg-white text-neutral-700 rounded-full"
                : "text-white hover:bg-white group-hover:text-black rounded-md mr-4"
        );

        const handleClick = () => {

        };

        const [expandedChildIndex, setExpandedChildIndex] = useState<number | null>(null);

        const toggleChild = (childKey: string) => {
            setExpandedMenu((prev) =>
                prev.includes(childKey) ? prev.filter((k) => k !== childKey) : [...prev, childKey]
            );
        };

        return (


            <div className="w-full">

                {hasChildren ? (
                    <div className="relative w-full">
                        {/* {isActive && (
              <div className="absolute right-0  bottom-0 w-10 h-5 bg-black rounded-t-full shadow-md z-10" />
            )} */}

                        <div className={itemClass}>
                            <div
                                className={cn(
                                    "w-full flex items-center rounded-full transition-all",
                                    isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center"
                                )}
                            >
                                <div
                                    onClick={handleToggle}
                                    className={cn(
                                        "flex items-center w-full rounded-md cursor-pointer transition-colors ",
                                        isSidebarExpanded ? "space-x-2" : "justify-center",
                                        "hover:bg-transparent group-hover:text-neutral-800"
                                    )}
                                >
                                    {icon}
                                    {isSidebarExpanded && <span className="text-sm hover:text-neutral-800">{label}</span>}
                                </div>

                                {isSidebarExpanded && label === "Items" && (
                                    <div className="ml-auto mr-1 group-hover:text-neutral-800 ">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`${path}/new-item`);
                                            }}
                                            title="Add New"
                                        >
                                            <FaPlus size={12} />
                                        </button>
                                    </div>
                                )}

                                {isSidebarExpanded && (
                                    <div onClick={handleToggle} className="ml-auto cursor-pointer group-hover:text-neutral-800 ">
                                        {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                ) : logout ? (
                    <div onClick={handleClick} className={itemClass}>
                        <div
                            className={cn(
                                "w-full flex items-center rounded-md transition-all cursor-pointer text-white",
                                isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center",
                                "hover:bg-white hover:text-black",
                            )}
                        >
                            <span className="group-hover:text-black transition-colors">{icon}</span>
                            {isSidebarExpanded && <span className="flex-1 text-sm group-hover:text-black transition-colors">{label}</span>}
                        </div>
                    </div>
                ) : (
                    <div className="w-full group">
                        <Link href={path} className={cn(itemClass, "no-underline")}>
                            <div
                                className={cn(
                                    "w-full flex items-center rounded-md transition-all cursor-pointer",
                                    isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center",
                                    "group-hover:text-black",

                                )}
                            >
                                <span className="group-hover:text-black transition-colors">{icon}</span>
                                {isSidebarExpanded && (
                                    <span className="flex-1 text-sm group-hover:text-black transition-colors">
                                        {label}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>
                )}



                {hasChildren && isExpanded && isSidebarExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                        {children.map((child, idx) => {
                            const hasSubChildren = Array.isArray(child.children) && child.children.length > 0;
                            const childKey = `${label}-${idx}`;
                            const isChildExpanded = expandedMenu.includes(childKey);

                            return (
                                <div key={idx}>
                                    {hasSubChildren ? (
                                        // <div
                                        //   onClick={() => toggleChild(childKey)}
                                        //   className={cn(
                                        //     "cursor-pointer block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-neutral-200/60",
                                        //     pathname.startsWith(child.href)
                                        //       ? "bg-white text-neutral-700 dark:bg-neutral-800/60 dark:text-white rounded-full mr-6"
                                        //       : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
                                        //   )}
                                        // >
                                        //   <span className="group-hover:text-neutral-800">{child.name}</span>
                                        // </div>

                                        <div onClick={() => toggleChild(childKey)} className={cn('mr-6 cursor-pointer relative flex items-center whitespace-nowrap rounded-md text-base transition-all duration-300',
                                            pathname.startsWith(child.href) ? 'bg-white text-neutral-700 rounded-full' : 'text-white hover:bg-white hover:text-black group'
                                        )}>
                                            <div

                                                className={cn(
                                                    "cursor-pointer block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-white  ml-2",
                                                    pathname.startsWith(child.href)
                                                        ? "bg-white text-neutral-700 rounded-full mr-6"
                                                        : "  hover:text-black mr-6"
                                                )}
                                            >
                                                <span className="group-hover:text-neutral-800">{child.name}</span>
                                            </div>
                                            {
                                                isSidebarExpanded && (
                                                    <div className='ml-auto cursor-pointer group-hover:text-black mr-2 '>
                                                        {isChildExpanded ? <FaChevronLeft /> : <FaChevronRight />}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <Link
                                            href={child.href}
                                            className={cn(
                                                "block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-white text-white ml-2 no-underline",
                                                // pathname === child.href || pathname.startsWith(child.href + '/')
                                                pathname === child.href || pathname.startsWith(child.href + '/')
                                                    ? "bg-white text-neutral-700  rounded-full mr-6"
                                                    : " hover:text-black mr-6"
                                            )}
                                        >
                                            <span className="group-hover:text-neutral-800">{child.name}</span>
                                        </Link>
                                    )}

                                    {/* Sub-sub menu */}
                                    {hasSubChildren && isChildExpanded && (
                                        <div className="ml-4 mt-1 space-y-1">
                                            {child.children?.map((subChild, subIdx) => (
                                                <Link
                                                    key={subIdx}
                                                    href={subChild.href}
                                                    className={cn(
                                                        "block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-white text-white no-underline",
                                                        pathname?.includes(subChild.href)
                                                            ? "bg-white text-neutral-700 rounded-full mr-6"
                                                            : "  hover:text-black mr-6"
                                                    )}
                                                >
                                                    <span className="group-hover:text-neutral-800">{subChild.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        );
    };


// components/PillCorner.tsx
function PillCorner() {
    return (
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-bl-full z-10 shadow-md" />
    );
}
