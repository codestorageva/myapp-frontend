'use client';
import Layout from '@/app/component/layout'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { CompanyData, getAllCompanies, restoreCompany, softDeleteCompany } from '../main-dashboard/company-list';
import { GetAllParams } from '../items/items';
import { toast } from 'react-toastify';
import CustomButton from '@/app/component/buttons/page';
import OrganizationCard from '@/app/component/organization-card/page';
import DeleteRestoreModal from '@/app/component/modal';
import Colors from '@/app/utils/colors';

const DeleteCompanies = () => {
  const router = useRouter();
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const params: Partial<GetAllParams> = {
    sortDirection: 'asc',
    isDeleted: true
  }


  useEffect(() => {
    get();
  }, [])

  const get = async () => {
    console.log("Refresh =================> ")
    try {
      setIsLoading(true)
      const res = await getAllCompanies(params as GetAllParams);
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

  const handleShow = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)

  const restore = async () => {
    if (selectedCompanyId) {
      let res = await restoreCompany({ id: selectedCompanyId });
      if (res.success == true) {
        get();
      } else {
        toast.error(`🤔 ${res.message}`, { autoClose: 2000 });
      }
    }
    setIsModalOpen(false);
  }

  return (
    <Layout showSidebar={false}>
      <div className="p-4 sm:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Deleted Organizations</h2>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              These organizations have been deleted. You can restore them if needed or remove them permanently.
            </p>
          </div>
           <CustomButton name='Back' className="text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition font-inter" style={{ background: `linear-gradient(to right, ${Colors.gradient1}, ${Colors.gradient2})` }}  onClick={() => router.back()} />

        </div>

        <h3 className="text-md font-semibold text-gray-800 mb-3">
          My Organizations{' '}
          <span className="ml-2 bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
            {companyData.length}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companyData.map((org) => (
            <OrganizationCard key={org.companyId} data={org} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} onRestoreClick={() => { setSelectedCompanyId(org.companyId.toString()); handleShow(); }} isDeleted={true}/>
          ))}
        </div>

        <DeleteRestoreModal
          isModalVisible={isModalOpen}
          title="Organization"
          message=''
          onclick={restore}
          onHide={handleClose}
          closeNoBtn={handleClose}
          okBtn={handleClose}
          hasPermissionChanged={false}
          isSoftDeletePage
        />
      </div>
    </Layout>
  )
}

export default DeleteCompanies