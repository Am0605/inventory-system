import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'Low Stock', href: '/inventory/low-stock' },
];

interface Product {
    id: number;
    name: string;
    sku: string;
    category: { name: string };
    warehouse: { name: string; code: string };
    stock_quantity: number;
    min_stock_level: number;
    price: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface LowStockProps {
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
}

export default function LowStock({ products }: LowStockProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Low Stock Items" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Low Stock Items</h1>
                        <p className="text-gray-600">Products that need restocking</p>
                    </div>
                </div>

                {products.data.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                        <AlertTriangle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Low Stock Items</h3>
                        <p className="text-gray-600">All products are adequately stocked!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm border">
                        <div className="px-6 py-4 border-b bg-orange-50">
                            <div className="flex items-center">
                                <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                                <span className="text-sm font-medium text-orange-800">
                                    {products.data.length} item(s) require immediate attention
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SKU
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Warehouse
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Current Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Min Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.data.map((product) => (
                                        <tr key={product.id} className="bg-red-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.sku}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.category.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>
                                                    <div className="font-medium">{product.warehouse?.name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-400">{product.warehouse?.code || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                                                {product.stock_quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.min_stock_level}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                                    Low Stock
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}