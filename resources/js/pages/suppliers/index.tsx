import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Truck, Plus, Mail, Phone, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Suppliers', href: '/suppliers' },
];

interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    contact_person: string;
    is_active: boolean;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface SuppliersProps {
    suppliers: {
        data: Supplier[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
}

export default function SuppliersIndex({ suppliers }: SuppliersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suppliers" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Truck className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
                            <p className="text-gray-600">Manage your supplier relationships</p>
                        </div>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Supplier
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suppliers.data.map((supplier) => (
                        <div key={supplier.id} className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center mb-4">
                                <Truck className="h-10 w-10 text-blue-600 mr-3" />
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                        supplier.is_active 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {supplier.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex items-center text-sm text-gray-600">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{supplier.contact_person}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                    <span>{supplier.email}</span>
                                </div>
                                {supplier.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{supplier.phone}</span>
                                    </div>
                                )}
                                <div className="text-sm text-gray-600">
                                    <p className="truncate">{supplier.address}</p>
                                </div>
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