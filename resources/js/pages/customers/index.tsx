import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Plus, Mail, Phone, Building } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customers', href: '/customers' },
];

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    is_active: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface CustomersProps {
    customers: {
        data: Customer[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
}

export default function CustomersIndex({ customers }: CustomersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                            <p className="text-gray-600">Manage your customer relationships</p>
                        </div>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.data.map((customer) => (
                        <div key={customer.id} className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center mb-4">
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        customer.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {customer.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                {customer.company && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{customer.company}</span>
                                    </div>
                                )}
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{customer.email}</span>
                                </div>
                                {customer.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{customer.phone}</span>
                                    </div>
                                )}
                                {customer.address && (
                                    <div className="text-sm text-gray-600">
                                        <p className="truncate">{customer.address}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-4 pt-4 border-t flex justify-between">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    View Orders
                                </button>
                                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}