import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ShoppingCart, Plus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders' },
    { title: 'Create Order', href: '/orders/create' },
];

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface CreateOrderProps {
    customers: Customer[];
}

export default function CreateOrder({ customers }: CreateOrderProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Order" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center">
                    <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Order</h1>
                        <p className="text-gray-600">Create a new sales order</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <form className="space-y-6">
                        {/* Order Header */}
                        <div className="border-b pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Number
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        placeholder="Auto-generated"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Date
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Customer
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                                        <option value="">Select a customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name} ({customer.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-b pb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product
                                </button>
                            </div>
                            <div className="border border-gray-300 rounded-lg p-8 text-center">
                                <div className="text-gray-500">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                    <p className="text-lg font-medium mb-2">No items added yet</p>
                                    <p>Click "Add Product" to start building your order</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtotal
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        value="RM0.00"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tax
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        value="RM0.00"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-bold"
                                        value="RM0.00"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add any special instructions or notes..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Create Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}