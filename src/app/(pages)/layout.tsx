// layout.tsx
"use client";
import { useEffect, useState } from "react";
import HeaderComponent from "../component/Header-main";
// import SideNav from "../component/sidenav";
import Colors from "../utils/colors";
import SideNav from "../component/drawer";



export default function Layout({
    children,
    showSidebar = true,
}: {
    children: React.ReactNode;
    showSidebar?: boolean;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 640px)'); // sm breakpoint

        const handleResize = () => {
            if (mediaQuery.matches) {
                setSidebarOpen(false); // Reset mobile sidebar when switching to desktop
            }
        };

        handleResize(); // initial check
        mediaQuery.addEventListener('change', handleResize);

        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    return (
        // <div className={`flex flex-col h-screen bg-[${Colors.trueBlue}] p-0 m-0`}>
        //     {/* <HeaderComponent /> */}

        //     <div className="flex flex-1 overflow-hidden">
        //         {showSidebar && <SideNav />}
        //         <main className={`flex-1 overflow-y-auto rounded-2xl p-4 hide-scrollbar`}>
        //             <HeaderComponent />
        //             {children}
        //         </main>
        //     </div>
        // </div>


        <div className="relative min-h-screen w-full p-0 m-0">
            <div className="absolute top-0 left-0 w-full h-[30vh] bg-[--trueBlue]" style={{ backgroundColor: Colors.gray }} /> <div className="relative z-10 flex h-screen">
                <SideNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 overflow-y-auto mr-5 hide-scrollbar max-[640px]:ml-2 max-[640px]:mr-2 sm:ml-0">
                    <div className="sticky top-0 z-20 backdrop-blur-md">
                        <HeaderComponent showProfileSection={false} setSidebarOpen={setSidebarOpen} />
                    </div>
                    {/* <div className="rounded-xl bg-[#F5F2F2] p-1 shadow-md mb-4 mt-1 "> */}
                    <div className="rounded-xl bg-[#F5F2F2] p-1 shadow-md mb-4 mt-1">
                        {children}
                    </div>
                </main>
            </div>
        </div>

        // <div className="relative min-h-screen w-full p-0 m-0">
        //     {/* Top color bar */}
        //     <div className="absolute top-0 left-0 w-full h-[30vh]" style={{ backgroundColor: Colors.gray }} />

        //     <div className="relative z-10 flex h-screen">
        //         <SideNav />

        //         <main className="flex-1 overflow-hidden mr-5 flex flex-col">
        //             {/* Sticky Header */}
        //             <div className="sticky top-0 z-20 backdrop-blur-md">
        //                 <HeaderComponent showProfileSection={false} />
        //             </div>

        //             {/* Scrollable content area that fills remaining height */}
        //             <div className="flex-1 overflow-y-auto hide-scrollbar bg-[#F5F2F2] rounded-xl p-1 shadow-md mt-1 mb-4">
        //                 {children}
        //             </div>
        //         </main>
        //     </div>
        // </div>

    );
}