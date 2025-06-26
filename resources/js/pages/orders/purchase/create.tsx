import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Truck, Plus, Minus, Calendar, DollarSign } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders/list' },
    { title: 'Purchase Orders', href: '/orders/purchase' },
    { title: 'Create Purchase Order', href: '/orders/purchase/create' },
];

interface Supplier {
    id: number;
    name: string;
    email: string;
    company: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    cost: number;
    unit: string;
}

interface CreatePurchaseOrderProps {
    suppliers: Supplier[];
    products: Product[];
}

interface OrderItem {
    product_id: string;
    quantity: string;
    unit_cost: string;
    total: number;
}

export default function CreatePurchaseOrder({ suppliers, products }: CreatePurchaseOrderProps) {
    const [items, setItems] = useState<OrderItem[]>([
        { product_id: '', quantity: '1', unit_cost: '0', total: 0 }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        order_date: new Date().toISOString().split('T')[0],
        delivery_date: '',
        notes: '',
        subtotal: 0,
        tax_amount: 0,
        total: 0,
        items: items,
    });

    const addItem = () => {
        const newItem = { product_id: '', quantity: '1', unit_cost: '0', total: 0 };
        const newItems = [...items, newItem];
        setItems(newItems);
        setData('items', newItems);
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        setData('items', newItems);
        calculateTotals(newItems);
    };

    const updateItem = (index: number, field: keyof OrderItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };

        if (field === 'product_id') {
            const product = products.find(p => p.id.toString() === value);
            if (product) {
                newItems[index].unit_cost = product.cost.toString();
            }
        }

        if (field === 'quantity' || field === 'unit_cost') {
            const quantity = parseFloat(newItems[index].quantity) || 0;
            const unitCost = parseFloat(newItems[index].unit_cost) || 0;
            newItems[index].total = quantity * unitCost;
        }

        setItems(newItems);
        setData('items', newItems);
        calculateTotals(newItems);
    };

    const calculateTotals = (itemsToCalculate: OrderItem[]) => {
        const subtotal = itemsToCalculate.reduce((sum, item) => sum + item.total, 0);
        const taxAmount = subtotal * 0.06; // 6% tax
        const total = subtotal + taxAmount;

        setData(prev => ({
            ...prev,
            subtotal,
            tax_amount: taxAmount,
            total,
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post(route('orders.purchase.store'), {
            onSuccess: () => {
                // Will redirect to purchase orders list
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR'
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Purchase Order" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center">
                    <Truck className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
                        <p className="text-gray-600">Create a new purchase order from supplier</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Order Information */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Supplier <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="">Select Supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name} {supplier.company && `(${supplier.company})`}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplier_id && <div className="mt-1 text-sm text-red-600">{errors.supplier_id}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={data.order_date}
                                        onChange={(e) => setData('order_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                                {errors.order_date && <div className="mt-1 text-sm text-red-600">{errors.order_date}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expected Delivery Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={data.delivery_date}
                                        onChange={(e) => setData('delivery_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                                {errors.delivery_date && <div className="mt-1 text-sm text-red-600">{errors.delivery_date}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Additional notes or instructions"
                                />
                                {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Item
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Product</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Quantity</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Unit Cost</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index} className="border-b border-gray-100">
                                            <td className="py-3 px-4">
                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="">Select Product</option>
                                                    {products.map((product) => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.name} ({product.sku})
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-3 px-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.unit_cost}
                                                        onChange={(e) => updateItem(index, 'unit_cost', e.target.value)}
                                                        className="w-28 pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-sm font-medium text-gray-900">
                                                {formatCurrency(item.total)}
                                            </td>
                                            <td className="py-3 px-4">
                                                {items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {errors.items && <div className="mt-2 text-sm text-red-600">{errors.items}</div>}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        
                        <div className="space-y-3 max-w-md ml-auto">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">{formatCurrency(data.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (6%):</span>
                                <span className="font-medium">{formatCurrency(data.tax_amount)}</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">{formatCurrency(data.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || items.length === 0}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Creating...' : 'Create Purchase Order'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}