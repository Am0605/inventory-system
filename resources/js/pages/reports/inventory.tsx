import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Package, DollarSign } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '/reports' },
    { title: 'Inventory Report', href: '/reports/inventory' },
];

interface InventoryItem {
    id: number;
    name: string;
    sku: string;
    category: { name: string };
    stock_quantity: number;
    cost: number;
    stock_value: number;
}

interface InventoryReportProps {
    inventory_data: InventoryItem[];
}

export default function InventoryReport({ inventory_data }: InventoryReportProps) {
    const totalValue = inventory_data.reduce((sum, item) => sum + parseFloat(item.stock_value.toString()), 0);
    const totalItems = inventory_data.reduce((sum, item) => sum + item.stock_quantity, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory Report" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Inventory Report</h1>
                        <p className="text-gray-600">Overview of your current inventory valuation</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Inventory Value</h3>
                                <p className="text-3xl font-bold text-green-600">RM{totalValue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <Package className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Items</h3>
                                <p className="text-3xl font-bold text-blue-600">{totalItems}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-medium text-gray-900">Inventory Details</h3>
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
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Unit Cost
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {inventory_data.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.sku}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.category.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.stock_quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            RM{Number(item.cost).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            RM{Number(item.stock_value).toFixed(2)}
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