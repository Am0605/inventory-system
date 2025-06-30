import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Users, Plus, Edit, ChevronLeft, ChevronRight } from 'lucide-react';

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
    orders_count: number;
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
        from: number;
        to: number;
        total: number;
        per_page: number;
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
                    <Link
                        href="/customers/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Customer
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Orders
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {customers.data.length > 0 ? (
                                    customers.data.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {customer.name}
                                                    </div>
                                                    {customer.address && (
                                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                                            {customer.address}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {customer.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {customer.phone || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {customer.company || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {customer.orders_count} orders
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    customer.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {customer.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <Link
                                                    href={`/customers/${customer.id}/edit`}
                                                    className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" />
                                                    Edit
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                <h3 className="text-lg font-medium mb-2">No customers found</h3>
                                                <p>Get started by adding your first customer.</p>
                                                <Link
                                                    href="/customers/create"
                                                    className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Customer
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ Added: Table Summary */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{customers.from}</span> to{' '}
                                <span className="font-medium">{customers.to}</span> of{' '}
                                <span className="font-medium">{customers.total}</span> customers
                            </div>
                            <div className="text-sm text-gray-500">
                                Page {customers.current_page} of {customers.last_page}
                            </div>
                        </div>
                    </div>

                    {/* ✅ Added: Pagination */}
                    {customers.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{customers.from}</span> to{' '}
                                    <span className="font-medium">{customers.to}</span> of{' '}
                                    <span className="font-medium">{customers.total}</span> results
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    {/* Previous Page */}
                                    {customers.current_page > 1 ? (
                                        <Link
                                            href={customers.links[0].url!}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed">
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </span>
                                    )}

                                    {/* Page Numbers */}
                                    <div className="flex space-x-1">
                                        {customers.links.slice(1, -1).map((link, index) => (
                                            <div key={index}>
                                                {link.url ? (
                                                    <Link
                                                        href={link.url}
                                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                                                            link.active
                                                                ? 'bg-blue-600 text-white border-blue-600'
                                                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ) : (
                                                    <span
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-lg"
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Next Page */}
                                    {customers.current_page < customers.last_page ? (
                                        <Link
                                            href={customers.links[customers.links.length - 1].url!}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed">
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}