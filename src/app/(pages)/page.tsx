'use client'
import Image from "next/image";
import Login from "../(auth)/login/page";
import { useSession } from "next-auth/react";
import MainDashboard from "./main-dashboard/page";

export default function Home() {
  const { status } = useSession();

  if(status === 'unauthenticated')
  {
    setTimeout(
      ()=> {
        window.location.reload();
        return;
      }
    );
    return (<main></main>)
  }
  try
  {
    return <MainDashboard/>
  }
  catch(e)
  {
    return <Login/>
  }
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import MainDashboard from './main-dashboard/page';
// import Login from '../(auth)/login/page';

// export default function Home() {
//   const { status } = useSession();
//   const router = useRouter();
//   const [showDashboard, setShowDashboard] = useState(false);

//   useEffect(() => {
//     if (status === 'loading') return; // wait for session to load

//     if (status === 'unauthenticated') {
//       router.replace('/login'); // redirect instead of reload
//       return;
//     }

//     const companyId = localStorage.getItem('selectedCompanyId');

//     if (companyId) {
//       router.replace(`/dashboard-page?companyId=${companyId}`);
//     } else {
//       setShowDashboard(true)
//     }
//   }, [status, router]);

//   if (status === 'loading' || !showDashboard) {
//     return null; 
//   }

//   return <MainDashboard />;
// }

