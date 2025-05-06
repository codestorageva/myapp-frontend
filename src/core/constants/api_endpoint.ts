export const API_ENDPOINTS = {
    companyReg: 'company',
    companyList: 'company',
    companyDetails: 'company/',
    companyDelete: '/company/softDelete/',
    companyUpdate: '/company/',
    companyRestore: '/company/restore/'
}

export const API_DATABASE_ENDPOINT = {
    item: {
        addItem: '/product',
        allItems: '/product',
        softDelete: '/product/softDelete/',
        getSingleItem: '/product/',
        updateItem : '/product/',
        allRestoreItems: '/product',
        itemRestore: '/product/restore/'
    },
    state: {
        getAlState: '/state',
        softDelete:'/state/softDelete/',
        addState: '/state',
        updateState: '/state/',
        getSingleState:'/state/',
        stateRestore: '/state/restore/'
    },
    city:{
        getAllCityByStateId: '/city/active',
        getAllCity: '/city',
        softDelete: '/city/softDelete/',
        addCity: '/city',
        updateCity: '/city/',
        getSingleCity:'/city/',
        restoreCity: '/city/restore/'
    },
    customer:
    {
        addCustomer: '/customer',
        getAllCustomer: '/customer',
        softDelete: '/customer/softDelete/',
        restoreCustomer:'/customer/restore/',
        getSingleCustomer: '/customer/',
        updateCustomer: '/customer/'
    },
    invoice:{
        generate: '/invoice',
        getById: '/invoice/',
        getAll: '/invoice'
    }
}