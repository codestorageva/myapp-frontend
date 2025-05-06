'use client';

import { usePathname } from 'next/navigation';
import {
  FaTachometerAlt,
  FaBuilding,
  FaFileInvoiceDollar,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import { ReactNode } from 'react';

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

  const isNavItemActive = (path: string) => pathname.startsWith(path);

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard-page',
      icon: <FaTachometerAlt />,
      active: pathname === '/dashboard-page',
      position: 'top',
    },
    // {
    //   name: 'Company Registration',
    //   href: '/company-registration',
    //   icon: <FaBuilding />,
    //   active: isNavItemActive('/company-registration'),
    //   position: 'top',
    // },
    {
      name: 'Invoice',
      href: '/generate-invoice',
      icon: <FaFileInvoiceDollar />,
      active: isNavItemActive('/generate-invoice'),
      position: 'top',
      children: [
        {
          name: 'Generate Invoice',
          href: '/generate-invoice',
          icon: null,
          active: pathname === '/generate-invoice'
        },
        {
          name: 'View Invoices',
          href: '/generate-invoice/view',
          icon: null,
          active: pathname === '/generate-invoice/view'
        }
      ]
    },
    // {
    //   name: 'Company List',
    //   href: '/company-list',
    //   icon: <FaBuilding />,
    //   active: isNavItemActive('/'),
    //   position: 'top',
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
        {
          name: 'New Item',
          href: '/items/new-item',
          icon: null,
          active: pathname === '/items/new-item',
        },
      ],
    },
    {
      name: 'Customer',
      href: '/customer',
      icon:  <FaUser />,
      active: isNavItemActive('/customer'),
      position: 'top',
      onAddClickHref: '/customer',
      children:[
        {
          name: 'Customer List',
          href: '/customer',
          icon: null,
          active: pathname==='/customer'
        },
        {
          name: 'Add Customer',
          href: '/customer/add',
          icon: null,
          active: pathname === '/customer/add'
        }
      ]
    },
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
          children: [
            {
              name: 'State List',
              href: '/database/state',
              icon: null,
              active: pathname === '/database/state',
            },
            {
              name: 'New State',
              href: '/database/state/new',
              icon: null,
              active: pathname === '/database/state/new',
            },
          ],
        },
        {
          name: 'City',
          href: '/database/city',
          icon: null,
          active: isNavItemActive('/database/city'),
          children: [
            {
              name: 'City List',
              href: '/database/city',
              icon: null,
              active: pathname === '/database/city',
            },
            {
              name: 'New City',
              href: '/database/city/new',
              icon: null,
              active: pathname === '/database/city/new',
            },
          ],
        },
      ],
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
