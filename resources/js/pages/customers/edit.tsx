import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Users, Trash2, AlertTriangle, ShoppingCart, Calendar, Mail, Phone, Building, MapPin } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customers', href: '/customers' },
    { title: 'Edit Customer', href: '' },
];

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    company: string;
    is_active: boolean;
    orders_count: number;
    created_at: string;
}

interface EditCustomerProps {
    customer: Customer;
}

export default function EditCustomer({ customer }: EditCustomerProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || '',
        address: customer.address || '',
        company: customer.company || '',
        is_active: customer.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        put(route('customers.update', customer.id));
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('customers.destroy', customer.id), {
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

    const canDelete = customer.orders_count === 0;
    const memberSince = new Date(customer.created_at).toLocaleDateString();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Customer" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
                            <p className="text-gray-600">Update customer information</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        disabled={!canDelete}
                        className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                            canDelete 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        title={!canDelete ? 'Cannot delete customer with orders' : 'Delete customer'}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Customer
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            autoFocus
                                        />
                                        {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.phone && <div className="mt-1 text-sm text-red-600">{errors.phone}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Company
                                        </label>
                                        <input
                                            type="text"
                                            value={data.company}
                                            onChange={(e) => setData('company', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.company && <div className="mt-1 text-sm text-red-600">{errors.company}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select 
                                            value={data.is_active ? '1' : '0'}
                                            onChange={(e) => setData('is_active', e.target.value === '1')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="1">Active</option>
                                            <option value="0">Inactive</option>
                                        </select>
                                        {errors.is_active && <div className="mt-1 text-sm text-red-600">{errors.is_active}</div>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.address && <div className="mt-1 text-sm text-red-600">{errors.address}</div>}
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Updating...' : 'Update Customer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Customer Overview */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Overview</h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-sm">
                                    <Mail className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-600 truncate">{customer.email}</span>
                                </div>
                                
                                {customer.phone && (
                                    <div className="flex items-center text-sm">
                                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                                        <span className="text-gray-600">{customer.phone}</span>
                                    </div>
                                )}
                                
                                {customer.company && (
                                    <div className="flex items-center text-sm">
                                        <Building className="h-4 w-4 text-gray-400 mr-3" />
                                        <span className="text-gray-600">{customer.company}</span>
                                    </div>
                                )}
                                
                                {customer.address && (
                                    <div className="flex items-start text-sm">
                                        <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-600">{customer.address}</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                                    <span className="text-gray-600">Member since {memberSince}</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Stats */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Statistics</h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Total Orders</dt>
                                    <dd className="text-2xl font-bold text-blue-600 flex items-center">
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        {customer.orders_count}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            customer.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {customer.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Delete Warning */}
                        {!canDelete && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-sm font-medium text-yellow-800">Cannot Delete Customer</h4>
                                            <p className="text-xs text-yellow-700 mt-1">
                                                This customer has {customer.orders_count} order{customer.orders_count !== 1 ? 's' : ''} and cannot be deleted. 
                                                You can deactivate the customer instead.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Delete Customer</h3>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Are you sure you want to delete this customer? This action cannot be undone.
                                </p>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">{customer.name}</div>
                                        <div className="text-gray-500">{customer.email}</div>
                                        {customer.company && (
                                            <div className="text-gray-500">{customer.company}</div>
                                        )}
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
                                            Delete Customer
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