import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '/reports' },
    { title: 'Sales Report', href: '/reports/sales' },
];

interface SalesData {
    date: string;
    total_sales: number;
    order_count: number;
}

interface SalesReportProps {
    sales_data: SalesData[];
}

export default function SalesReport({ sales_data }: SalesReportProps) {
    const totalSales = sales_data.reduce((sum, item) => sum + parseFloat(item.total_sales.toString()), 0);
    const totalOrders = sales_data.reduce((sum, item) => sum + item.order_count, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sales Report" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Sales Report</h1>
                        <p className="text-gray-600">Track your sales performance over time</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
                                <p className="text-3xl font-bold text-green-600">RM{totalSales.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                                <p className="text-3xl font-bold text-blue-600">{totalOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sales Data Table */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-medium text-gray-900">Daily Sales (Last 30 Days)</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Sales
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Count
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Average Order
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sales_data.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            RM{parseFloat(item.total_sales.toString()).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item.order_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            RM{item.order_count > 0 ? (parseFloat(item.total_sales.toString()) / item.order_count).toFixed(2) : '0.00'}
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