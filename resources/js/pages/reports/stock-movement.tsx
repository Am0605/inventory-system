import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { History, TrendingUp, TrendingDown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '/reports' },
    { title: 'Stock Movement', href: '/reports/stock-movement' },
];

interface OrderItem {
    product: { name: string; sku: string };
    quantity: number;
    unit_price: number;
}

interface Movement {
    id: number;
    order_number: string;
    type: string;
    order_date: string;
    customer?: { name: string };
    supplier?: { name: string };
    order_items: OrderItem[];
}

interface StockMovementProps {
    movements: Movement[];
}

export default function StockMovement({ movements }: StockMovementProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Movement Report" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center">
                    <History className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Stock Movement Report</h1>
                        <p className="text-gray-600">Track inventory movements and transactions</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-medium text-gray-900">Recent Stock Movements</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Movement
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Partner/Customer
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {movements.map((movement) => (
                                    movement.order_items.map((item, itemIndex) => (
                                        <tr key={`${movement.id}-${itemIndex}`}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(movement.order_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {movement.order_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    movement.type === 'sale' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {movement.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {item.product.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        SKU: {item.product.sku}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {movement.type === 'sale' ? (
                                                        <>
                                                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                                            <span className="text-red-600 font-medium">OUT</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                                            <span className="text-green-600 font-medium">IN</span>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {movement.customer?.name || movement.supplier?.name || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}