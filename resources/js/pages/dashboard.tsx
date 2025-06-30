import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { 
    Package, 
    ShoppingCart, 
    Users, 
    Truck, 
    AlertTriangle,
    TrendingUp 
} from 'lucide-react';
import { toast } from 'sonner'; // ✅ Add this import
import { useEffect } from 'react'; // ✅ Add this import

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface Stats {
    total_products: number;
    low_stock_products: number;
    total_orders: number;
    pending_orders: number;
    total_customers: number;
    total_suppliers: number;
}

interface Order {
    id: number;
    order_number: string;
    type: string;
    status: string;
    total: number;
    order_date: string;
    customer?: { name: string };
    supplier?: { name: string };
}

interface DashboardProps {
    stats: Stats;
    recent_orders: Order[];
}

export default function Dashboard({ stats, recent_orders }: DashboardProps) {
    // ✅ Show toast notification when component mounts
    useEffect(() => {
        // Check if email verification is disabled (you can pass this from backend)
        const emailVerificationDisabled = true; // This could come from props or env
        
        if (emailVerificationDisabled) {
            toast.info('Email verification is currently disabled for testing purposes', {
                description: 'Users can register and login without email verification',
                duration: 6000,
                action: {
                    label: 'Got it',
                    onClick: () => toast.dismiss(),
                },
            });
        }
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR'
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome to your inventory management system</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <Package className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Products</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.total_products}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Low Stock Items</h3>
                                <p className="text-3xl font-bold text-orange-600">{stats.low_stock_products}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <ShoppingCart className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Orders</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.total_orders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Pending Orders</h3>
                                <p className="text-3xl font-bold text-purple-600">{stats.pending_orders}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-indigo-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Customers</h3>
                                <p className="text-3xl font-bold text-indigo-600">{stats.total_customers}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border">
                        <div className="flex items-center">
                            <Truck className="h-8 w-8 text-red-600 mr-3" />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Total Suppliers</h3>
                                <p className="text-3xl font-bold text-red-600">{stats.total_suppliers}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer/Supplier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recent_orders.length > 0 ? (
                                    recent_orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {order.order_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    order.type === 'sale' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {order.type === 'sale' ? 'Sales' : 'Purchase'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.customer?.name || order.supplier?.name || 'N/A'}
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
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.order_date).toLocaleDateString('en-MY')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                <h3 className="text-lg font-medium mb-2">No recent orders</h3>
                                                <p>Orders will appear here once you start creating them.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
