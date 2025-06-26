import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { ShoppingCart, Plus, X, Search, AlertCircle, Package } from 'lucide-react';
import { FormEventHandler, useState, useCallback } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders/list' },
    { title: 'Sales Orders', href: '/orders/sales' },
    { title: 'Create Sales Order', href: '' },
];

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

// Type for form items (what gets sent to the backend)
interface FormOrderItem {
    product_id: number;
    quantity: number;
    unit_price: number;
    total: number;
    [key: string]: string | number;
}

interface CreateSalesOrderProps {
    customers: Customer[];
    products: Product[];
}

export default function CreateSalesOrder({ customers, products }: CreateSalesOrderProps) {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [tempIdCounter, setTempIdCounter] = useState(1000000); // Better ID generation
    
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        order_date: new Date().toISOString().split('T')[0],
        delivery_date: '',
        notes: '',
        subtotal: 0,
        tax_amount: 0,
        total: 0,
        items: [] as FormOrderItem[],
    });

    // Filter products and exclude out-of-stock items
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const inStock = product.stock_quantity > 0;
        return matchesSearch && inStock;
    });

    // Generate unique temporary ID
    const generateTempId = useCallback(() => {
        setTempIdCounter(prev => prev + 1);
        return tempIdCounter;
    }, [tempIdCounter]);

    const addProduct = (product: Product) => {
        // Check stock availability
        if (product.stock_quantity <= 0) {
            alert(`Sorry, ${product.name} is out of stock.`);
            return;
        }

        const existingItem = orderItems.find(item => item.product_id === product.id);
        
        if (existingItem) {
            // Check if we can add more quantity
            if (existingItem.quantity >= product.stock_quantity) {
                alert(`Cannot add more. Only ${product.stock_quantity} ${product.unit} available in stock.`);
                return;
            }
            updateQuantity(existingItem.id, existingItem.quantity + 1);
        } else {
            const newItem: OrderItem = {
                id: generateTempId(), // Better temporary ID generation
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

        // Find the item to check stock
        const item = orderItems.find(item => item.id === itemId);
        if (item && quantity > item.product.stock_quantity) {
            alert(`Cannot set quantity to ${quantity}. Only ${item.product.stock_quantity} ${item.product.unit} available in stock.`);
            return;
        }
        
        const updatedItems = orderItems.map(item => {
            if (item.id === itemId) {
                const newTotal = Number(item.unit_price) * Number(quantity);
                return {
                    ...item,
                    quantity: Number(quantity),
                    total: newTotal,
                };
            }
            return item;
        });
        
        setOrderItems(updatedItems);
        updateFormTotals(updatedItems);
    };

    const updateUnitPrice = (itemId: number, unitPrice: number) => {
        if (unitPrice < 0) {
            alert('Unit price cannot be negative.');
            return;
        }

        const updatedItems = orderItems.map(item => {
            if (item.id === itemId) {
                const newTotal = Number(unitPrice) * Number(item.quantity);
                return {
                    ...item,
                    unit_price: Number(unitPrice),
                    total: newTotal,
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
        const subtotal = items.reduce((sum, item) => {
            const itemTotal = Number(item.total) || 0;
            return sum + itemTotal;
        }, 0);
        
        const taxAmount = subtotal * 0.06; // 6% tax
        const total = subtotal + taxAmount;
        
        setData(prev => ({
            ...prev,
            subtotal: Number(subtotal.toFixed(2)),
            tax_amount: Number(taxAmount.toFixed(2)),
            total: Number(total.toFixed(2)),
            items: items.map(item => ({
                product_id: item.product_id,
                quantity: Number(item.quantity) || 0,
                unit_price: Number(item.unit_price) || 0,
                total: Number(item.total) || 0,
            })) as FormOrderItem[],
        }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        // Enhanced validation
        if (orderItems.length === 0) {
            alert('Please add at least one product to the order.');
            return;
        }

        if (!data.customer_id) {
            alert('Please select a customer.');
            return;
        }

        if (!data.order_date) {
            alert('Please select an order date.');
            return;
        }

        // Check if any item exceeds stock
        const stockIssues = orderItems.filter(item => item.quantity > item.product.stock_quantity);
        if (stockIssues.length > 0) {
            alert(`Stock issue: ${stockIssues.map(item => item.product.name).join(', ')} exceed available stock.`);
            return;
        }
        
        post(route('orders.sales.store'));
    };

    const formatCurrency = (amount: number) => {
        const validAmount = Number(amount) || 0;
        return new Intl.NumberFormat('en-MY', {
            style: 'currency',
            currency: 'MYR'
        }).format(validAmount);
    };

    const getTotalItemsCount = () => {
        return orderItems.reduce((sum, item) => sum + item.quantity, 0);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Sales Order" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Create Sales Order</h1>
                            <p className="text-gray-600">Create a new sales order for a customer</p>
                        </div>
                    </div>
                    {/* Order Summary Badge */}
                    {orderItems.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                            <div className="text-sm text-blue-800">
                                <div className="font-medium">{orderItems.length} products, {getTotalItemsCount()} items</div>
                                <div>Total: {formatCurrency(data.total)}</div>
                            </div>
                        </div>
                    )}
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
                                        placeholder="Auto-generated"
                                        disabled
                                    />
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
                                        required
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
                                        min={data.order_date} // Can't deliver before order date
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.delivery_date && <div className="mt-1 text-sm text-red-600">{errors.delivery_date}</div>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Customer <span className="text-red-500">*</span>
                                    </label>
                                    <select 
                                        value={data.customer_id}
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        required
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
                                        <p className="text-lg font-medium mb-2">No items added yet</p>
                                        <p>Click "Add Product" to start building your order</p>
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
                                                <tr key={item.id} className={item.quantity > item.product.stock_quantity ? 'bg-red-50' : ''}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <div>
                                                            {item.product.name}
                                                            {item.quantity > item.product.stock_quantity && (
                                                                <div className="flex items-center text-red-600 text-xs mt-1">
                                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                                    Exceeds stock
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.product.sku}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                max={item.product.stock_quantity}
                                                                value={item.quantity}
                                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                                                className={`w-20 px-2 py-1 border rounded text-sm ${
                                                                    item.quantity > item.product.stock_quantity 
                                                                        ? 'border-red-300 bg-red-50' 
                                                                        : 'border-gray-300'
                                                                }`}
                                                            />
                                                            <span className="text-sm text-gray-500">
                                                                {item.product.unit}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            Stock: {item.product.stock_quantity}
                                                        </div>
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
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                        {formatCurrency(item.total)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
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
                                {processing ? 'Creating Order...' : 'Create Order'}
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
                                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                                        <Package className="h-3 w-3 mr-1" />
                                                        Stock: {product.stock_quantity} {product.unit}
                                                        {product.stock_quantity <= 5 && (
                                                            <span className="ml-2 text-yellow-600 text-xs">Low Stock</span>
                                                        )}
                                                    </div>
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
                                    {filteredProducts.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            {searchTerm ? (
                                                <div>
                                                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                    <p className="text-lg font-medium mb-2">No products found</p>
                                                    <p>No products match "{searchTerm}" or they are out of stock</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                    <p className="text-lg font-medium mb-2">No products available</p>
                                                    <p>All products are out of stock</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}