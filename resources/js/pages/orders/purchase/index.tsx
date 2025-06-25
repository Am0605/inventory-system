import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link} from '@inertiajs/react';
import { FileText, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders' },
    { title: 'Purchase Orders', href: '/orders/purchase' },
];

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    order_date: string;
    supplier?: { name: string };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PurchaseOrdersProps {
    orders: {
        data: Order[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
}

export default function PurchaseOrders({ orders }: PurchaseOrdersProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Purchase Orders" />
            
            <div className="space-y-6 p-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
                            <p className="text-gray-600">Manage orders from your suppliers</p>
                        </div>
                    </div>
                    <Link
                        href="/orders/purchase/create"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Purchase Order
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        PO Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Supplier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.data.map((order) => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {order.order_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.supplier?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                order.status === 'pending' 
                                                    ? 'bg-yellow-100 text-yellow-800' 
                                                    : order.status === 'confirmed'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : order.status === 'shipped'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : order.status === 'delivered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            RM{Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(order.order_date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}