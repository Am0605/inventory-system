import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { DollarSign, TrendingUp, TrendingDown, Package } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reports', href: '/reports' },
    { title: 'Financial Report', href: '/reports/financial' },
];

interface FinancialData {
    total_sales: number;
    total_purchases: number;
    inventory_value: number;
}

interface FinancialReportProps {
    financial_data: FinancialData;
}

export default function FinancialReport({ financial_data }: FinancialReportProps) {
    const grossProfit = financial_data.total_sales - financial_data.total_purchases;
    const profitMargin = financial_data.total_sales > 0 
        ? ((grossProfit / financial_data.total_sales) * 100).toFixed(2) 
        : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Financial Report" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Financial Report</h1>
                        <p className="text-gray-600">Overview of your financial performance</p>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
                                <p className="text-3xl font-bold text-green-600">
                                    RM{Number(financial_data.total_sales).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <TrendingDown className="h-8 w-8 text-red-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Purchases</h3>
                                <p className="text-3xl font-bold text-red-600">
                                    RM{Number(financial_data.total_purchases).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Gross Profit</h3>
                                <p className={`text-3xl font-bold ${
                                    grossProfit >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    RM{grossProfit.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <Package className="h-8 w-8 text-purple-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Inventory Value</h3>
                                <p className="text-3xl font-bold text-purple-600">
                                    RM{Number(financial_data.inventory_value).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-base font-medium text-gray-900 mb-4">Profit & Loss</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Revenue (Sales)</span>
                                        <span className="font-medium text-green-600">
                                            RM{Number(financial_data.total_sales).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cost of Goods Sold</span>
                                        <span className="font-medium text-red-600">
                                            -RM{Number(financial_data.total_purchases).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-900">Gross Profit</span>
                                            <span className={`font-bold ${
                                                grossProfit >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                RM{grossProfit.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Profit Margin</span>
                                        <span className={`font-medium ${
                                            parseFloat(profitMargin.toString()) >= 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {profitMargin}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-base font-medium text-gray-900 mb-4">Assets</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Inventory Value</span>
                                        <span className="font-medium">
                                            RM{Number(financial_data.inventory_value).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cash from Sales</span>
                                        <span className="font-medium">
                                            RM{Number(financial_data.total_sales).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-900">Total Assets</span>
                                            <span className="font-bold text-blue-600">
                                                RM{Number(financial_data.inventory_value + financial_data.total_sales).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}