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

const SideNav = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const navItems = NavItems();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const [expandedMenu, setExpandedMenu] = useState<string[]>([]); // NEW

  useEffect(() => {
    setHasMounted(true);
    const saved = window.localStorage.getItem('sidebarExpanded');
    setIsSidebarExpanded(saved === null ? true : JSON.parse(saved));
  }, []);

  const toggleSidebar = () => {
    const nextState = !isSidebarExpanded;
    setIsSidebarExpanded(nextState);
    window.localStorage.setItem('sidebarExpanded', JSON.stringify(nextState));
  };

  if (!hasMounted) return null;

  return (
    <div className={cn(isSidebarExpanded ? 'w-[250px]' : 'w-[68px]', 'bg-gradient-to-t from-[#03508C] to-[#0874CB] transition-all duration-300 ease-in-out transform hidden sm:flex h-fill ')}>
      <aside className='flex h-full flex-col w-full break-words overflow-x-hidden columns-1'>
        <div className='mt-4 relative pb-2'>
          <div className='flex flex-col space-y-1'>
            {navItems.map((item, idx) => {
              if (item.position === 'top') {
                return (
                  <Fragment key={idx}>
                    <div className='space-y-1'>
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
                  </Fragment>
                );
              }
              return null;
            })}
          </div>
        </div>
        <div className="sticky bottom-0 mt-auto whitespace-nowrap mb-4 transition duration-200 block">
          {navItems.map((item, idx) => {
            if (item.position === 'bottom') {
              return (
                <Fragment key={idx}>
                  <div className="space-y-1">
                    <SideNavItem
                      label={item.name}
                      icon={item.icon}
                      path={item.href}
                      active={item.active}
                      isSidebarExpanded={isSidebarExpanded}
                      children={item.children}
                      expandedMenu={expandedMenu}
                      setExpandedMenu={setExpandedMenu}
                      logout={item.logout}
                    />
                  </div>
                </Fragment>
              );
            }
          })}
        </div>
      </aside>

      <div className='mt-[calc(90vh-40px)] relative'>
        <button
          type='button'
          className='bg-white absolute bottom-32 right-[-15px] flex h-8 w-8 items-center justify-center border-muted-foreground/20 rounded-full bg-accent shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out'
          onClick={toggleSidebar}
        >
          {isSidebarExpanded ? <ChevronLeft size={16} className='stroke-foreground' /> : <ChevronRight size={16} className='stroke-foreground' />}
        </button>
      </div>
    </div>
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

// export const SideNavItem: React.FC<{
//   label: string;
//   icon: any;
//   path: string;
//   active: boolean;
//   isSidebarExpanded: boolean;
//   children?: NavChild[];
//   expandedMenu: string[];
//   setExpandedMenu: React.Dispatch<React.SetStateAction<string[]>>;
//   logout?: boolean;
// }> = ({
//   label,
//   icon,
//   path,
//   active,
//   isSidebarExpanded,
//   children,
//   expandedMenu,
//   setExpandedMenu,
//   logout = false
// }) => {
//     const pathname = usePathname();
//     const hasChildren = !!children && children.length > 0;
//     const hasSubChildren =
//       hasChildren && children.some((child) => child.children && child.children.length > 0);
//     const router = useRouter();
//     const isChildRoute = hasChildren
//       ? children.some((child) => pathname === child.href)
//       : false;

//     const isExpanded = expandedMenu.includes(label);
//     const isActive = active || isChildRoute;

//     useEffect(() => {
//       if (isChildRoute) {
//         setExpandedMenu((prev) =>
//           prev.includes(label) ? prev : [...prev, label]
//         );
//       }
//     }, [pathname, label, isChildRoute, setExpandedMenu]);

//     const handleToggle = () => {
//       setExpandedMenu((prev) =>
//         prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
//       );
//     };

//     // const itemClass = cn(
//     //     "cursor-pointer font-inter relative flex items-center whitespace-nowrap rounded-md text-base transition-all duration-300",
//     //     isActive
//     //         ? "bg-neutral-200/60 text-neutral-700 dark:bg-neutral-800/60 dark:text-white"
//     //         : "text-white hover:bg-white hover:text-black group"
//     // );
//     const itemClass = cn(
//       "cursor-pointer font-inter relative flex items-center whitespace-nowrap text-base transition-all duration-300 ml-4",
//       isActive
//         ? "bg-white text-neutral-700 dark:bg-neutral-800/60 dark:text-white rounded-l-full"
//         : "text-white hover:bg-neutral-200/60 hover:text-black group mr-4 rounded-md"
//     );


//     const handleClick = () => {

//     };

//     const [expandedChildIndex, setExpandedChildIndex] = useState<number | null>(null);

//     const toggleChild = (idx: any) => {
//       setExpandedChildIndex(prev => (prev === idx ? null : idx));
//     };

//     return (
//       // <div className="w-full">
//       //     {hasChildren ? (
//       //         <div className={itemClass}>
//       //             <div className="w-full py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md">
//       //                 <div onClick={handleToggle} className="flex items-center space-x-2 flex-1 cursor-pointer group-hover:text-neutral-800">
//       //                     {icon}
//       //                     {isSidebarExpanded && <span className="text-inherit hover:text-neutral-800">{label}</span>}
//       //                 </div>

//       //                 {isSidebarExpanded && label === 'Items' && (
//       //                     <div className='mr-2 group-hover:text-neutral-800'>
//       //                         <button onClick={(e) => {
//       //                             e.stopPropagation();
//       //                             router.push(`${path}/new-item`);
//       //                         }}
//       //                             title="Add New">
//       //                             <FaPlus size={12} />
//       //                         </button>
//       //                     </div>
//       //                 )}
//       //                 {isSidebarExpanded && (
//       //                     <div onClick={handleToggle} className="ml-auto cursor-pointer group-hover:text-neutral-800">
//       //                         {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
//       //                     </div>
//       //                 )}
//       //             </div>
//       //         </div>
//       //     ) : logout ? (
//       //         <div onClick={handleClick} className={itemClass}>
//       //             <div className="w-full py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md">
//       //                 {icon}
//       //                 {isSidebarExpanded && <span className="flex-1">{label}</span>}
//       //             </div>
//       //         </div>
//       //     ) : (
//       //         <div className="w-full group">
//       //             <Link href={path} className={itemClass}>
//       //                 <div className="w-full py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md group-hover:text-neutral-800">
//       //                     {icon}
//       //                     {isSidebarExpanded && <span className="flex-1 group-hover:text-neutral-800">{label}</span>}
//       //                 </div>
//       //             </Link>
//       //         </div>
//       //     )}

//       //     {/* Submenu */}
//       //     {hasChildren && isExpanded && isSidebarExpanded && (
//       //         <div className="ml-6 mt-1 space-y-1">
//       //             {children.map((child, idx) => (
//       //                 <Link
//       //                     key={idx}
//       //                     href={child.href}
//       //                     className={cn(
//       //                         "block px-2 py-1 text-sm rounded-md transition-colors duration-200 group",
//       //                         pathname === child.href
//       //                             ? "bg-neutral-200/60 text-neutral-700 dark:bg-neutral-800/60 dark:text-white"
//       //                             : "text-white hover:bg-white hover:text-black"
//       //                     )}
//       //                 >
//       //                     <span className="group-hover:text-neutral-800">{child.name}</span>
//       //                 </Link>
//       //             ))}
//       //         </div>
//       //     )}
//       // </div>

//       <div className="w-full">
//         {hasChildren ? (
//           <div className={itemClass}>
//             <div
//               className={cn(
//                 "w-full flex items-center rounded-full transition-all",
//                 isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center"
//               )}
//             >
//               <div
//                 onClick={handleToggle}
//                 className={cn(
//                   "flex items-center w-full rounded-md cursor-pointer transition-colors",
//                   isSidebarExpanded ? "space-x-2" : "justify-center",
//                   "hover:bg-transparent group-hover:text-neutral-800",
//                 )}
//               >
//                 {icon}
//                 {isSidebarExpanded && <span className="text-sm hover:text-neutral-800">{label}</span>}
//               </div>

//               {isSidebarExpanded && label === "Items" && (
//                 <div className="ml-auto mr-1 group-hover:text-neutral-800">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       router.push(`${path}/new-item`);
//                     }}
//                     title="Add New"
//                   // className="text-white hover:text-black hover:bg-white p-1 rounded"
//                   >
//                     <FaPlus size={12} />
//                   </button>
//                 </div>
//               )}

//               {isSidebarExpanded && (
//                 <div onClick={handleToggle} className="ml-auto cursor-pointer group-hover:text-neutral-800">
//                   {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : logout ? (
//           <div onClick={handleClick} className={itemClass}>
//             <div
//               className={cn(
//                 "w-full flex items-center rounded-md transition-all cursor-pointer",
//                 isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center",
//                 "hover:bg-neutral-200/40 hover:text-black",
//               )}
//             >
//               {icon}
//               {isSidebarExpanded && <span className="flex-1 text-sm">{label}</span>}
//             </div>
//           </div>
//         ) : (
//           <div className="w-full group">
//             <Link href={path} className={itemClass}>
//               <div
//                 className={cn(
//                   "w-full flex items-center rounded-md transition-all cursor-pointer",
//                   isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center",
//                   "group-hover:text-neutral-800",

//                 )}
//               >
//                 {icon}
//                 {isSidebarExpanded && <span className="flex-1 text-sm">{label}</span>}
//               </div>
//             </Link>
//           </div>
//         )}

//         {/* Children */}
//         {/* {hasChildren && isExpanded && isSidebarExpanded && (
//           <div className="ml-6 mt-1 space-y-1">
//             {children.map((child, idx) => (
//               <Link
//                 key={idx}
//                 href={child.href}
//                 className={cn(
//                   "block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-neutral-200/60",
//                   pathname === child.href
//                     ? "bg-white text-neutral-700 dark:bg-neutral-800/60 dark:text-white rounded-full mr-6"
//                     : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
//                 )}
//               >
//                 <span className="group-hover:text-neutral-800">{child.name}</span>
//               </Link>
//             ))}
//           </div>
//         )} */}


//         {hasChildren && isExpanded && isSidebarExpanded && (
//           <div className="ml-6 mt-1 space-y-1">
//             {children.map((child, idx) => {
//               const hasSubChildren = Array.isArray(child.children) && child.children.length > 0;
//               const isChildExpanded = expandedChildIndex === idx;

//               return (
//                 <div key={idx}>
//                   {hasSubChildren ? (
//                     <div
//                       onClick={() => toggleChild(idx)}
//                       className={cn(
//                         "cursor-pointer block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-neutral-200/60",
//                         pathname.startsWith(child.href)
//                           ? "bg-white text-neutral-700 dark:bg-neutral-800/60 dark:text-white rounded-full mr-6"
//                           : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
//                       )}
//                     >
//                       <span className="group-hover:text-neutral-800">{child.name}</span>
//                     </div>
//                   ) : (
//                     <Link
//                       href={child.href}
//                       className={cn(
//                         "block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-neutral-200/60",
//                         pathname === child.href
//                           ? "bg-white text-neutral-700 dark:bg-neutral-800/60 dark:text-white rounded-full mr-6"
//                           : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
//                       )}
//                     >
//                       <span className="group-hover:text-neutral-800">{child.name}</span>
//                     </Link>
//                   )}

//                   {/* Sub-sub menu */}
//                   {hasSubChildren && isChildExpanded && (
//                     <div className="ml-4 mt-1 space-y-1">
//                       {child.children?.map((subChild, subIdx) => (
//                         <Link
//                           key={subIdx}
//                           href={subChild.href}
//                           className={cn(
//                             "block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-neutral-200/60",
//                             pathname?.includes(subChild.href)
//                               ? "bg-white text-neutral-700 dark:bg-neutral-800/60 dark:text-white rounded-full mr-6"
//                               : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
//                           )}
//                         >
//                           <span className="group-hover:text-neutral-800">{subChild.name}</span>
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* 
//         {hasChildren && isExpanded && isSidebarExpanded && (
//           <div className="ml-6 mt-1 space-y-1">
//             {children.map((child, idx) => {
//               const isSubExpanded = expandedMenu.includes(child.name);
//               const isChildActive = pathname === child.href;

//               return (
//                 <div key={idx}>
//                   <div
//                     onClick={() => {
//                       if (child.children && child.children.length > 0) {
//                         setExpandedMenu(prev =>
//                           prev.includes(child.name)
//                             ? prev.filter(label => label !== child.name)
//                             : [...prev, child.name]
//                         );
//                       } else {
//                         router.push(child.href);
//                       }
//                     }}
//                     className={cn(
//                       "flex items-center px-2 py-1 text-sm transition-all cursor-pointer",
//                       isChildActive
//                         ? "bg-white text-neutral-700 dark:bg-neutral-800/60 dark:text-white rounded-full mr-6"
//                         : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
//                     )}
//                   >
//                     <span className="flex-1">{child.name}</span>
//                     {child.children && child.children.length > 0 && (
//                       <span className="ml-auto">{isSubExpanded ? <FaChevronLeft /> : <FaChevronRight />}</span>
//                     )}
//                   </div>
//                   {child.children && child.children.length > 0 && isSubExpanded && (
//                     <div className="ml-4 mt-1 space-y-1">
//                       {child.children.map((sub, subIdx) => (
//                         <Link
//                           key={subIdx}
//                           href={sub.href}
//                           className={cn(
//                             "block px-2 py-1 text-sm transition-colors duration-200 group",
//                             pathname === sub.href
//                               ? "bg-white text-neutral-700 dark:bg-neutral-800/60 dark:text-white rounded-full mr-6"
//                               : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
//                           )}
//                         >
//                           <span className="group-hover:text-neutral-800">{sub.name}</span>
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )} */}
//       </div>
//     );
//   };


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
    };

    // const itemClass = cn(
    //     "cursor-pointer font-inter relative flex items-center whitespace-nowrap rounded-md text-base transition-all duration-300",
    //     isActive
    //         ? "bg-neutral-200/60 text-neutral-700 dark:bg-neutral-800/60 dark:text-white"
    //         : "text-white hover:bg-white hover:text-black group"
    // );
    const itemClass = cn(
      "cursor-pointer font-inter relative flex items-center whitespace-nowrap text-base transition-all duration-300 ml-4",
      isActive
        ? "bg-white text-neutral-700 rounded-l-full"
        : "text-white hover:bg-neutral-200/60 hover:text-black group mr-4 rounded-md"
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
          // <div className='relative w-full'>
          //   {isActive && <PillCorner />}
          //   <div className={itemClass}>

          //     <div
          //       className={cn(
          //         "w-full flex items-center rounded-full transition-all",
          //         isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center"
          //       )}
          //     >
          //       <div
          //         onClick={handleToggle}
          //         className={cn(
          //           "flex items-center w-full rounded-md cursor-pointer transition-colors",
          //           isSidebarExpanded ? "space-x-2" : "justify-center",
          //           "hover:bg-transparent group-hover:text-neutral-800",
          //         )}
          //       >
          //         {icon}
          //         {isSidebarExpanded && <span className="text-sm hover:text-neutral-800">{label}</span>}
          //       </div>

          //       {isSidebarExpanded && label === "Items" && (
          //         <div className="ml-auto mr-1 group-hover:text-neutral-800">
          //           <button
          //             onClick={(e) => {
          //               e.stopPropagation();
          //               router.push(`${path}/new-item`);
          //             }}
          //             title="Add New"
          //           // className="text-white hover:text-black hover:bg-white p-1 rounded"
          //           >
          //             <FaPlus size={12} />
          //           </button>
          //         </div>
          //       )}

          //       {isSidebarExpanded && (
          //         <div onClick={handleToggle} className="ml-auto cursor-pointer group-hover:text-neutral-800">
          //           {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          //         </div>
          //       )}
          //     </div>
          //   </div>
          // </div>
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
                    "flex items-center w-full rounded-md cursor-pointer transition-colors",
                    isSidebarExpanded ? "space-x-2" : "justify-center",
                    "hover:bg-transparent group-hover:text-neutral-800"
                  )}
                >
                  {icon}
                  {isSidebarExpanded && <span className="text-sm hover:text-neutral-800">{label}</span>}
                </div>

                {isSidebarExpanded && label === "Items" && (
                  <div className="ml-auto mr-1 group-hover:text-neutral-800">
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
                  <div onClick={handleToggle} className="ml-auto cursor-pointer group-hover:text-neutral-800">
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
                "w-full flex items-center rounded-md transition-all cursor-pointer",
                isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center",
                "hover:bg-neutral-200/40 hover:text-black",
              )}
            >
              {icon}
              {isSidebarExpanded && <span className="flex-1 text-sm">{label}</span>}
            </div>
          </div>
        ) : (
          <div className="w-full group">
            <Link href={path} className={itemClass}>
              <div
                className={cn(
                  "w-full flex items-center rounded-md transition-all cursor-pointer",
                  isSidebarExpanded ? "py-1.5 px-2 flex-row space-x-2" : "py-2 justify-center",
                  "group-hover:text-neutral-800",

                )}
              >
                {icon}
                {isSidebarExpanded && <span className="flex-1 text-sm">{label}</span>}
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
                      pathname.startsWith(child.href) ? 'bg-white text-neutral-700 rounded-full' : 'text-white hover:bg-neutral-200/60 hover:text-black group'
                    )}>
                      <div

                        className={cn(
                          "cursor-pointer block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-neutral-200/60",
                          pathname.startsWith(child.href)
                            ? "bg-white text-neutral-700 rounded-full mr-6"
                            : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
                        )}
                      >
                        <span className="group-hover:text-neutral-800">{child.name}</span>
                      </div>
                      {
                        isSidebarExpanded && (
                          <div className='ml-auto cursor-pointer group-hover:text-neutral-800 mr-2'>
                            {isChildExpanded ? <FaChevronLeft /> : <FaChevronRight />}
                          </div>
                        )
                      }
                    </div>
                  ) : (
                    <Link
                      href={child.href}
                      className={cn(
                        "block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-neutral-200/60",
                        pathname === child.href
                          ? "bg-white text-neutral-700  rounded-full mr-6"
                          : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
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
                            "block px-2 py-1 text-sm transition-colors duration-200 group hover:rounded-md hover:bg-neutral-200/60",
                            pathname?.includes(subChild.href)
                              ? "bg-white text-neutral-700 rounded-full mr-6"
                              : "text-white hover:bg-neutral-200/60 hover:text-black mr-6"
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
