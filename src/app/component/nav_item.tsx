'use client';

import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt,
  FaBuilding,
  FaFileInvoiceDollar,
  FaUser,
  FaSignOutAlt,
  FaCog
} from 'react-icons/fa';
import { ReactNode } from 'react';
import { FaChartLine, FaReceipt } from 'react-icons/fa6';

interface NavItem {
  name: string;
  href: string;
  icon: ReactNode;
  active: boolean;
  position?: string;
  children?: NavItem[];
  logout?: boolean;
  onAddClickHref?: string;
  onClick?: () => void;
}

const NavItems = (): NavItem[] => {
  const pathname = usePathname();

  // const isNavItemActive = (path: string) => pathname.startsWith(path);
  // const isNavItemActive = (path: string) => {
  //   console.log("Evaluating Path: ", path);
  //   console.log("Current Pathname: ", pathname);
  //   console.log("Starts with check: ", pathname.startsWith(path + '/'));

  //   // Check if pathname matches the path or starts with the path for sub-routes
  //   return pathname === path || pathname.startsWith(path + '/');
  // };

  const isNavItemActive = (path: string) => {
    const normalizedPath = path.replace(/\/$/, '');
    const normalizedCurrent = pathname.replace(/\/$/, '');
    return (
      normalizedCurrent === normalizedPath ||
      normalizedCurrent.startsWith(`${normalizedPath}/`)
    );
  };

  // const navItems: NavItem[] = [
  //   {
  //     name: 'Dashboard',
  //     href: '/dashboard-page',
  //     icon: <FaTachometerAlt />,
  //     active: pathname === '/dashboard-page',
  //     position: 'top',
  //   },
  //   // {
  //   //   name: 'Company Registration',
  //   //   href: '/company-registration',
  //   //   icon: <FaBuilding />,
  //   //   active: isNavItemActive('/company-registration'),
  //   //   position: 'top',
  //   // },
  //   {
  //     name: 'Invoice',
  //     href: '/generate-invoice',
  //     icon: <FaFileInvoiceDollar />,
  //     active: isNavItemActive('/generate-invoice'),
  //     position: 'top',
  //     children: [
  //       {
  //         name: 'Generate Invoice',
  //         href: '/generate-invoice',
  //         icon: null,
  //         active: pathname === '/generate-invoice'
  //       },
  //       {
  //         name: 'View Invoices',
  //         href: '/generate-invoice/view',
  //         icon: null,
  //         active: pathname === '/generate-invoice/view'
  //       }
  //     ]
  //   },
  //   // {
  //   //   name: 'Company List',
  //   //   href: '/company-list',
  //   //   icon: <FaBuilding />,
  //   //   active: isNavItemActive('/'),
  //   //   position: 'top',
  //   // },
  //   {
  //     name: 'Items',
  //     href: '/items',
  //     icon: <FaFileInvoiceDollar />,
  //     active: isNavItemActive('/items'),
  //     position: 'top',
  //     onAddClickHref: '/items/new-item',
  //     children: [
  //       {
  //         name: 'Item List',
  //         href: '/items',
  //         icon: null,
  //         active: pathname === '/items',
  //       },
  //       // {
  //       //   name: 'New Item',
  //       //   href: '/items/new-item',
  //       //   icon: null,
  //       //   active: pathname === '/items/new-item',
  //       // },
  //     ],
  //   },
  //   {
  //     name: 'Customer',
  //     href: '/customer',
  //     icon:  <FaUser />,
  //     active: isNavItemActive('/customer'),
  //     position: 'top',
  //     onAddClickHref: '/customer',
  //     children:[
  //       {
  //         name: 'Customer List',
  //         href: '/customer',
  //         icon: null,
  //         active: pathname==='/customer'
  //       },
  //       {
  //         name: 'Add Customer',
  //         href: '/customer/add',
  //         icon: null,
  //         active: pathname === '/customer/add'
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Database',
  //     href: '/database',
  //     icon: <FaBuilding />,
  //     active: isNavItemActive('/database'),
  //     position: 'top',
  //     children: [
  //       {
  //         name: 'State',
  //         href: '/database/state',
  //         icon: null,
  //         active: isNavItemActive('/database/state'),
  //          children: [
  //           {
  //             name: 'State List',
  //             href: '/database/state',
  //             icon: null,
  //             active: pathname === '/database/state',
  //           },
  //           {
  //             name: 'Add State',
  //             href: '/database/state/add',
  //             icon: null,
  //             active: pathname === '/database/state/add',
  //           },
  //         ],
  //       },
  //       {
  //         name: 'City',
  //         href: '/database/city',
  //         icon: null,
  //         active: isNavItemActive('/database/city') ,
  //         children: [
  //           {
  //             name: 'City List',
  //             href: '/database/city/list',
  //             icon: null,
  //             active: pathname === '/database/city/list',
  //           },
  //           {
  //             name: 'Add City',
  //             href: '/database/city/add',
  //             icon: null,
  //             active: pathname === '/database/city/add',
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     name: 'Setting',
  //     href: '/setting',
  //     icon: <FaCog/>,
  //     active: isNavItemActive('/setting'), 
  //     position: 'top',
  //     children:[
  //       {
  //         name: 'Profile',
  //         href:'/setting/profile',
  //         icon: null,
  //         active: pathname === '/setting/profile'
  //       }
  //     ]
  //   },
  //   {
  //     name: 'Logout',
  //     href: '', 
  //     icon: <FaSignOutAlt />,
  //     active: false,
  //     position: 'bottom',
  //     logout: true
  //   },
  // ];

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard-page',
      icon: <FaTachometerAlt />,
      active: pathname === '/dashboard-page',
      position: 'top',
    },
    {
      name: 'Purchase',
      href: '/purchase',
      icon: <FaReceipt />,
      active: isNavItemActive('/purchase'),
      position: 'top',
      children: [
        {
          name: 'Bills',
          href: '/purchase/bills',
          icon: undefined,
          active: pathname === '/purchase/bills'
        },
        {
          name: 'Vendor',
          href: '/purchase/vendor',
          icon: undefined,
          active: isNavItemActive('/purchase/vendor'),
          onAddClickHref: '/purchase/vendor',
          // children: [
          //   {
          //     name: 'Vendor List',
          //     href: '/purchase/vendor/list',
          //     icon: null,
          //     active: pathname === '/purchase/vendor/list'
          //   },
          //   {
          //     name: 'Add Vendor',
          //     href: '/purchase/vendor/add',
          //     icon: null,
          //     active: pathname === '/purchase/vendor/add'
          //   }
          // ]
        }
      ]
    },
    {
      name: 'Sales',
      href: '#',
      icon: <FaChartLine />,
      active: false,
      position: 'top',
      children: [
        {
          name: 'Invoice',
          href: '/sales/invoice',
          icon: <FaFileInvoiceDollar />,
          active: pathname === '/sales/invoice',
          // active: pathname.startsWith('/invoice'),
          position: 'top',
          // children: [
          //   {
          //     name: 'Generate Invoice',
          //     href: '/invoice/generate-invoice',
          //     icon: null,
          //     active: pathname === '/invoice/generate-invoice'
          //   },
          //   {
          //     name: 'View Invoices',
          //     href: '/invoice/view',
          //     icon: null,
          //     active: pathname === '/invoice/view'
          //   }
          // ]
        },
        {
          name: 'Customer',
          href: '/sales/customer',
          icon: <FaUser />,
          active: isNavItemActive('/sales/customer'),
          position: 'top',
          onAddClickHref: '/customer',
          // children: [
          //   {
          //     name: 'Customer List',
          //     href: '/customer/list',
          //     icon: null,
          //     active: pathname === '/customer/list'
          //   },
          //   {
          //     name: 'Add Customer',
          //     href: '/customer/add',
          //     icon: null,
          //     active: pathname === '/customer/add'
          //   }
          // ]
        },
      ]
    },

    // {
    //   name: 'Invoice',
    //   href: '/generate-invoice',
    //   icon: <FaFileInvoiceDollar />,
    //   active: isNavItemActive('/generate-invoice'),
    //   position: 'top',
    //   children: [
    //     {
    //       name: 'Generate Invoice',
    //       href: '/generate-invoice',
    //       icon: null,
    //       active: pathname === '/generate-invoice'
    //     },
    //     {
    //       name: 'View Invoices',
    //       href: '/generate-invoice/view',
    //       icon: null,
    //       active: pathname === '/generate-invoice/view'
    //     }
    //   ]
    // },
    {
      name: 'Items',
      href: '/items',
      icon: <FaFileInvoiceDollar />,
      active: isNavItemActive('/items'),
      position: 'top',
      onAddClickHref: '/items/new-item',
      children: [
        {
          name: 'Item List',
          href: '/items',
          icon: null,
          active: pathname === '/items',
        },
      ],
    },
    // {
    //   name: 'Customer',
    //   href: '/customer',
    //   icon: <FaUser />,
    //   active: isNavItemActive('/customer'),
    //   position: 'top',
    //   onAddClickHref: '/customer',
    //   children: [
    //     {
    //       name: 'Customer List',
    //       href: '/customer',
    //       icon: null,
    //       active: pathname === '/customer'
    //     },
    //     {
    //       name: 'Add Customer',
    //       href: '/customer/add',
    //       icon: null,
    //       active: pathname === '/customer/add'
    //     }
    //   ]
    // },
    {
      name: 'Database',
      href: '/database',
      icon: <FaBuilding />,
      active: isNavItemActive('/database'),
      position: 'top',
      children: [
        {
          name: 'State',
          href: '/database/state',
          icon: null,
          active: isNavItemActive('/database/state'),
          // children: [
          //   {
          //     name: 'State List',
          //     href: '/database/state/list',
          //     icon: null,
          //     active: pathname === '/database/state/list',
          //   },
          //   {
          //     name: 'Add State',
          //     href: '/database/state/add',
          //     icon: null,
          //     active: pathname === '/database/state/add',
          //   },
          // ],
        },
        {
          name: 'City',
          href: '/database/city',
          icon: null,
          active: isNavItemActive('/database/city'),
          // children: [
          //   {
          //     name: 'City List',
          //     href: '/database/city/list',
          //     icon: null,
          //     active: pathname === '/database/city/list',
          //   },
          //   {
          //     name: 'Add City',
          //     href: '/database/city/add',
          //     icon: null,
          //     active: pathname === '/database/city/add',
          //   },
          // ],
        },
      ],
    },
    {
      name: 'Setting',
      href: '/setting',
      icon: <FaCog />,
      active: isNavItemActive('/setting'),
      position: 'top',
      children: [
        {
          name: 'Profile',
          href: '/setting/profile',
          icon: null,
          active: pathname === '/setting/profile'
        }
      ]
    },
    {
      name: 'Logout',
      href: '',
      icon: <FaSignOutAlt />,
      active: false,
      position: 'bottom',
      logout: true
    },
  ];
  return navItems;
};

export default NavItems;
