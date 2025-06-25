import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, Plus, Edit, Calendar, User, DollarSign } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders' },
    { title: 'Sales Orders', href: '/orders/sales' },
];

interface Customer {
    id: number;
    name: string;
    email: string;
    company: string;
}

interface Order {
    id: number;
    order_number: string;
    customer: Customer;
    order_date: string;
    delivery_date: string;
    status: string;
    total: number;
    created_at: string;
}

interface SalesOrdersProps {
    orders: {
        data: Order[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
}

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function SalesOrders({ orders }: SalesOrdersProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-MY');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales Orders" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
                            <p className="text-gray-600">Manage customer orders and sales</p>
                        </div>
                    </div>
                    <Link
                        href="/orders/sales/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Sales Order
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dates
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
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
                                {orders.data.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {order.order_number}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: #{order.id}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 text-gray-400 mr-2" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.customer.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.customer.company || order.customer.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                                <div>
                                                    <div>Order: {formatDate(order.order_date)}</div>
                                                    {order.delivery_date && (
                                                        <div className="text-gray-500">
                                                            Delivery: {formatDate(order.delivery_date)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm font-medium text-gray-900">
                                                <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                                                {formatCurrency(order.total)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status as keyof typeof statusColors]}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <Link
                                                href={`/orders/${order.id}/edit`}
                                                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {orders.data.length === 0 && (
                        <div className="text-center py-12">
                            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No sales orders found</h3>
                            <p className="text-gray-500 mb-4">Get started by creating your first sales order.</p>
                            <Link
                                href="/orders/create"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Sales Order
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}