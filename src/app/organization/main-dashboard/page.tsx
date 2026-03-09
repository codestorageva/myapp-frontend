'use client'
import CustomButton from '@/app/component/buttons/page';
import HeaderComponent from '@/app/component/Header-main';
import OrganizationCard from '@/app/component/organization-card/page';
import Colors from '@/app/utils/colors';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // You can replace this with your avatar logic
import { CompanyData, getAllCompanies, softDeleteCompany } from './company-list';
import DeleteRestoreModal from '@/app/component/modal';
import { toast } from 'react-toastify';
import { GetAllParams } from '../../(pages)/items/items';
import OrgLayout from '@/app/component/layout';

const MainDashboard = () => {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const params: Partial<GetAllParams> = {
    sortDirection: 'asc'
  }

  useEffect(() => {
    get();
  }, [])

  const get = async () => {
    console.log("Refresh =================> ")
    try {
      setIsLoading(true)
      const res = await getAllCompanies(params as GetAllParams);
      console.log("Get All Companies Response ==================> ", res.data)
      setIsLoading(false)
      console.log("Response ====> ", res)
      if (res.success) {
        setCompanyData(res.data)
      }
      else {
        alert('Something went wrong!')
      }
    }
    catch (e) {
      console.log(e)
    }
    finally {
      setIsLoading(false)
    }
  }

  const orgData = [
    {
      id: '60040054941',
      name: 'abcdd',
      isDefault: true,
      createdAt: '17/04/2025',
      edition: 'India',
      role: 'admin',
    },
    {
      id: '60040054942',
      name: 'SuperOrg',
      isDefault: false,
      createdAt: '01/03/2024',
      edition: 'India',
      role: 'viewer',
    },
    // Add more as needed
  ];

  const handleShow = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)

  const deleteItem = async () => {
    if (selectedCompanyId) {
      let res = await softDeleteCompany({ id: selectedCompanyId });
      if (res.success == true) {
        get();
      } else {
        toast.error(`🤔 ${res.message}`, { autoClose: 2000 });
      }
    }
    setIsModalOpen(false);
  }

  return (
    <OrgLayout showSidebar={false}>
      <div className='bg-white h-full overflow-auto p-4'>
        <div className="p-4 sm:px-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome, </h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                You are a part of the following organizations. Go to the organization which you wish to access now.
              </p>
            </div>
            {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter">
            + New Organization
          </button> */}
            <div className='flex gap-2'>
              <CustomButton name='New Organization' className="text-white px-4 py-2 border-none rounded-lg text-sm  transition font-inter" style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }} icon={<FontAwesomeIcon icon={faPlus} />} onClick={() => router.push('/organization/company-registration')} />
              <CustomButton name='Delete Organization' className="text-white px-4 py-2 border-none rounded-lg text-sm transition font-inter" style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }} icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => { router.push('/organization/deleted_companies') }} />
            </div>

          </div>

          <h3 className="text-md font-semibold text-gray-800 mb-3">
            My Organizations{' '}
            <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              {companyData.length}
            </span>
          </h3>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyData.map((org) => (
            <OrganizationCard key={org.companyId} data={org} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} onEditClick={() => { router.push(`/company-registration?id=${org.companyId.toString()}`) }} onDeleteClick={() => { setSelectedCompanyId(org.companyId.toString()); handleShow(); }} />
          ))}
        </div> */}

          <div className="flex flex-wrap gap-4">
            {companyData.map((org) => (
              <div key={org.companyId} className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
                <OrganizationCard key={org.companyId} data={org} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} onEditClick={() => { router.push(`/organization/company-update?id=${org.companyId.toString()}`) }} onDeleteClick={() => { setSelectedCompanyId(org.companyId.toString()); handleShow(); }} />
              </div>
            ))}
          </div>

          <DeleteRestoreModal
            isModalVisible={isModalOpen}
            title="Organization"
            message=''
            onclick={deleteItem}
            onHide={handleClose}
            closeNoBtn={handleClose}
            okBtn={handleClose}
            hasPermissionChanged={false}
          />
        </div>
      </div>

    </OrgLayout>
  );
};

export default MainDashboard;
