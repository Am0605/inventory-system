import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { ShoppingCart, Plus, X, Search, Trash2, AlertTriangle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders/list' },
    { title: 'Sales Orders', href: '/orders/sales' },
    { title: 'Edit Sales Order', href: '' },
];

const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';
    
    // If it's already in the correct format (yyyy-MM-dd), return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }
    
    // Parse ISO date and format to yyyy-MM-dd
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toISOString().split('T')[0];
};

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    cost: number;
    stock_quantity: number;
    unit: string;
}

interface OrderItem {
    id: number;
    product_id: number;
    product: Product;
    quantity: number;
    unit_price: number;
    total: number;
}

interface Order {
    id: number;
    order_number: string;
    type: 'sale';
    status: string;
    order_date: string;
    delivery_date: string | null;
    notes: string | null;
    subtotal: number;
    tax_amount: number;
    total: number;
    customer: Customer;
    items: OrderItem[];
}

interface EditSalesOrderProps {
    order: Order;
    customers: Customer[];
    products: Product[];
}

export default function EditSalesOrder({ order, customers, products }: EditSalesOrderProps) {
    const [orderItems, setOrderItems] = useState<OrderItem[]>(order.items);
    const [showProductModal, setShowProductModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    const { data, setData, put, processing, errors } = useForm({
        customer_id: order.customer.id.toString(),
        order_date: formatDateForInput(order.order_date),
        delivery_date: formatDateForInput(order.delivery_date), 
        status: order.status,
        notes: order.notes || '',
        subtotal: order.subtotal,
        tax_amount: order.tax_amount,
        total: order.total,
        items: orderItems.map(item => ({
            id: item.id > 1000000 ? undefined : item.id, // New items have temporary IDs
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
        })) as any,
    });

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addProduct = (product: Product) => {
        const existingItem = orderItems.find(item => item.product_id === product.id);
        
        if (existingItem) {
            updateQuantity(existingItem.id, existingItem.quantity + 1);
        } else {
            const newItem: OrderItem = {
                id: Date.now(), // Temporary ID for new items
                product_id: product.id,
                product: product,
                quantity: 1,
                unit_price: product.price,
                total: product.price,
            };
            
            const updatedItems = [...orderItems, newItem];
            setOrderItems(updatedItems);
            updateFormTotals(updatedItems);
        }
        
        setShowProductModal(false);
        setSearchTerm('');
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }
        
        const updatedItems = orderItems.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    quantity,
                    total: item.unit_price * quantity,
                };
            }
            return item;
        });
        
        setOrderItems(updatedItems);
        updateFormTotals(updatedItems);
    };

    const updateUnitPrice = (itemId: number, unitPrice: number) => {
        const updatedItems = orderItems.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    unit_price: unitPrice,
                    total: unitPrice * item.quantity,
                };
            }
            return item;
        });
        
        setOrderItems(updatedItems);
        updateFormTotals(updatedItems);
    };

    const removeItem = (itemId: number) => {
        const updatedItems = orderItems.filter(item => item.id !== itemId);
        setOrderItems(updatedItems);
        updateFormTotals(updatedItems);
    };

    const updateFormTotals = (items: OrderItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const taxAmount = subtotal * 0.06; // 6% tax
        const total = subtotal + taxAmount;
        
        setData(prev => ({
            ...prev,
            subtotal,
            tax_amount: taxAmount,
            total,
            items: items.map(item => ({
                id: item.id > 1000000 ? undefined : item.id, // New items have temporary IDs
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total: item.total,
            })),
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (orderItems.length === 0) {
            alert('Please add at least one product to the order.');
            return;
        }
        
        put(route('orders.sales.update', order.id));
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('orders.destroy', order.id), {
            onSuccess: () => {
                // The page will redirect automatically
            },
            onError: () => {
                setIsDeleting(false);
                setShowDeleteModal(false);
            },
            onFinish: () => {
                setIsDeleting(false);
            }
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
            <Head title="Edit Sales Order" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Sales Order</h1>
                            <p className="text-gray-600">Order #{order.order_number}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Order
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <form onSubmit={submit} className="space-y-6">
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
                                        value={order.order_number}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select 
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    {errors.status && <div className="mt-1 text-sm text-red-600">{errors.status}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={data.order_date}
                                        onChange={(e) => setData('order_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.order_date && <div className="mt-1 text-sm text-red-600">{errors.order_date}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Delivery Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.delivery_date}
                                        onChange={(e) => setData('delivery_date', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.delivery_date && <div className="mt-1 text-sm text-red-600">{errors.delivery_date}</div>}
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Customer <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        value={data.customer_id}
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select a customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name} ({customer.email})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <div className="mt-1 text-sm text-red-600">{errors.customer_id}</div>}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-b pb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowProductModal(true)}
                                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Product
                                </button>
                            </div>
                            
                            {orderItems.length === 0 ? (
                                <div className="border border-gray-300 rounded-lg p-8 text-center">
                                    <div className="text-gray-500">
                                        <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                        <p className="text-lg font-medium mb-2">No items in this order</p>
                                        <p>Click "Add Product" to add items to this order</p>
                                    </div>
                                </div>
                            ) : (
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
                                                    Quantity
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Unit Price
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orderItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.product.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.product.sku}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                        <span className="ml-2 text-sm text-gray-500">{item.product.unit}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={item.unit_price}
                                                            onChange={(e) => updateUnitPrice(item.id, parseFloat(e.target.value) || 0)}
                                                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(item.total)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {errors.items && <div className="mt-2 text-sm text-red-600">{errors.items}</div>}
                        </div>

                        {/* Order Summary */}
                        <div className="border-b pb-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Subtotal
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        value={formatCurrency(data.subtotal)}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tax (6%)
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                        value={formatCurrency(data.tax_amount)}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-bold text-lg"
                                        value={formatCurrency(data.total)}
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
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add any special instructions or notes..."
                            />
                            {errors.notes && <div className="mt-1 text-sm text-red-600">{errors.notes}</div>}
                        </div>

                        {/* Actions */}
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
                                disabled={processing || orderItems.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Updating...' : 'Update Order'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Product Selection Modal */}
                {showProductModal && (
                    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Select Products</h3>
                                <button
                                    type="button"
                                    onClick={() => setShowProductModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="overflow-y-auto max-h-96">
                                <div className="grid grid-cols-1 gap-3">
                                    {filteredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => addProduct(product)}
                                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                                    <p className="text-sm text-gray-500">Stock: {product.stock_quantity} {product.unit}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">
                                                        {formatCurrency(product.price)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">Price</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Delete Sales Order</h3>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Are you sure you want to delete this sales order? This action cannot be undone.
                                </p>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">Order #{order.order_number}</div>
                                        <div className="text-gray-500">Customer: {order.customer.name}</div>
                                        <div className="text-gray-500">Total: {formatCurrency(order.total)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}