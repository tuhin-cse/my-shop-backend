const crud = [
    {
        name: 'Create',
        permission: 'create'
    },
    {
        name: 'Edit',
        permission: 'edit'
    },
    {
        name: 'Delete',
        permission: 'delete'
    },
    {
        name: 'Show',
        permission: 'show'
    }
]


const modules = [
    {
        name: 'Shops',
        permission: 'shop',
        child: crud
    },
    {
        name: 'Category',
        permission: 'category',
        child: crud
    },
    {
        name: 'Products',
        permission: 'product',
        child: crud
    },
    {
        name: 'Barcode',
        permission: 'barcode'
    },
    {
        name: 'Purchase',
        permission: 'purchase',
        child: crud
    },
    {
        name: 'Pos',
        permission: 'pos'
    },
    {
        name: 'Roles',
        permission: 'role',
        child: crud
    },
    {
        name: 'Users',
        permission: 'user',
        child: crud
    },
    {
        name: 'Companies',
        permission: 'company',
        child: crud
    },
    {
        name: 'NGO Company Manage',
        permission: 'ngo_manage',
    },
    {
        name: 'Ecommerce Company Manage',
        permission: 'company_manage',
    },
    {
        name: 'Company Product Average Change',
        permission: 'company_product_average_change',
    },
    {
        name: 'Company Projects',
        permission: 'project',
        child: crud
    },
    {
        name: 'Company Products',
        permission: 'company_product',
    },
    {
        name: 'Commission and Fees',
        permission: 'commission_fees',
    },
    {
        name: 'Project Rounds',
        permission: 'round',
        child: crud
    },
    {
        name: 'Project Beneficiaries',
        permission: 'project_beneficiary',
    },
    {
        name: 'Project Shops',
        permission: 'project_shop',
    },
    {
        name: 'Project Products',
        permission: 'project_product',
    },
    {
        name: 'Card Management',
        permission: 'card_management',
    }, {
        name: 'Direct Card Verify',
        permission: 'direct_card_verification',
    },
    {
        name: 'Card Transactions',
        permission: 'card_transactions',
    },
    {
        name: 'Wholesale Market',
        permission: 'wholesale_market',
    },
    {
        name: 'Purchase Management',
        permission: 'purchase_management'
    },
    {
        name: 'Credit Request Management',
        permission: 'credit_management'
    },
    {
        name: 'Sale Report',
        permission: 'sale_report'
    },
    {
        name: 'Purchase Report',
        permission: 'purchase_report'
    },
    {
        name: 'Card Transaction Report',
        permission: 'transaction_report'
    },
    {
        name: 'Customers',
        permission: 'customer',
        child: crud
    },
    {
        name: 'Deposit',
        permission: 'deposit',
        child: crud
    },
    {
        name: 'Site Admin',
        permission: 'site_admin'
    },
]

let permissions = modules?.map(m => {
    if (m.child) {
        return {
            ...m,
            child: m.child?.map(c => ({
                ...c,
                permission: `${m.permission}_${c.permission}`
            }))
        }
    }
    return m
})
export default permissions