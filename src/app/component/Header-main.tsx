"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Colors from "../utils/colors";
import logOut from "./logout_server_action";
import { FaBuilding } from "react-icons/fa6";

export default function HeaderComponent({ showProfileSection = true, setSidebarOpen }: { showProfileSection?: boolean; setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [userCollapsed, setUserCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  const userCollapsedMenu = () => {
    setUserCollapsed((prev) => !prev);
  };

  return (
    <header
      // className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-t from-[#03508C] to-[#0874CB]   border-gray-200 shadow-sm"
      className={`relative flex items-center justify-between px-6 py-4 transition-all duration-300
    ${showProfileSection ? 'bg-[#d4d4d4] shadow-md' : 'bg-transparent backdrop-blur-md'}
  `}

    // style={{
    //   backgroundImage: `linear-gradient(to top, ${Colors.gradient1}, ${Colors.gradient2})`,
    // }}
    >
      {/* <h1 className="text-xl font-semibold text-white">Vaistra</h1> */}

      {setSidebarOpen && (
        <button
          className="sm:hidden text-black"
          onClick={() => setSidebarOpen((prev) => !prev)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      <h1 className={`text-2xl font-semibold text-[#760000] pl-[30px]`}>Vaistra</h1>
      {
        showProfileSection && <div className="flex items-center gap-3 relative bg-white py-2 px-4 rounded">
          <div className="flex flex-col text-white text-sm text-right">
            <span className="font-medium text-black">
              {data?.user?.fullName ?? "User Name"}
            </span>
            <span className={`text-xs opacity-80 capitalize text-[${Colors.marun}]`}>
              {(data?.user?.roleName ?? "Superadmin").replace("ROLE_", "")}
            </span>
          </div>
          <div
            className={`w-9 h-9 rounded-full overflow-hidden cursor-pointer bg-[${Colors.marun}] flex justify-center items-center`}
            onClick={userCollapsedMenu}
          >
            <span className="text-white text-sm font-medium">
              {data?.user?.fullName?.charAt(0) ?? "S"}
            </span>
          </div>

          {userCollapsed && (
            <div className="absolute top-16 right-0 w-48 bg-white rounded-lg shadow-lg p-3 z-50">
              <div className="flex flex-col gap-3 text-sm text-gray-700">
                {/* <Link href={ROUTES.profile}>
                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <Image
                    src="/assets/icons/profile.png"
                    alt="Profile"
                    width={20}
                    height={20}
                  />
                  View Profile
                </div>
              </Link>

              <Link href={""}>
                <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                  <Image
                    src="/assets/icons/changepassword.png"
                    alt="Change Password"
                    width={20}
                    height={20}
                  />
                  Change Password
                </div>
              </Link> */}

                {/* <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600 gap-y-2" onClick={() => {
                  localStorage.removeItem('selectedCompanyId');
                  router.replace('/');
                }}>
                  <FaBuilding className="text-gray-600" size={20} />
                  Organizations
                </div> */}
                <button
                  onClick={() => {
                    let email: string | null = null;
                    let psw: string | null = null;
                    setIsLoading(true);

                    if (localStorage.getItem('savedEmail')) {
                      email = localStorage.getItem('savedEmail');
                    }
                    if (localStorage.getItem('savedPassword')) {
                      psw = localStorage.getItem('savedPassword');
                    }

                    sessionStorage.clear();
                    localStorage.clear();

                    if (email !== null && psw !== null) {
                      localStorage.setItem('savedEmail', email);
                      localStorage.setItem('savedPassword', psw);
                    }

                    signOut();
                  }}
                  className="flex items-center gap-2 text-left hover:text-red-600"
                >
                  <Image
                    src="/assets/icons/logout.png"
                    alt="Logout"
                    width={20}
                    height={20}
                  />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      }

    </header>
  );
}
