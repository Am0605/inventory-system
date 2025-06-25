import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Tags, Trash2, AlertTriangle, Package } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'Categories', href: '/inventory/categories' },
    { title: 'Edit Category', href: '' },
];

interface Product {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
    slug: string;
    is_active: boolean;
    products: Product[];
    products_count?: number; // Add this optional field
}

interface EditCategoryProps {
    category: Category;
}

export default function EditCategory({ category }: EditCategoryProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description || '',
        is_active: category.is_active,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        put(route('inventory.categories.update', category.id));
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('inventory.categories.destroy', category.id), {
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

    const productCount = category.products_count ?? category.products?.length ?? 0;

    const canDelete = productCount === 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Category" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Tags className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
                            <p className="text-gray-600">Update category information</p>
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
                        title={!canDelete ? 'Cannot delete category with associated products' : 'Delete category'}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Category
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Name <span className="text-red-500">*</span>
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
                                        Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description}</div>}
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
                                        {processing ? 'Updating...' : 'Update Category'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Category Info */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Category Details</h3>
                            <dl className="space-y-3">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Slug</dt>
                                    <dd className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                                        {category.slug}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Products Count</dt>
                                    <dd className="text-sm text-gray-900 font-semibold">
                                        {productCount} products
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Current Status</dt>
                                    <dd>
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            category.is_active 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {category.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Associated Products */}
                        {category.products.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Associated Products
                                </h3>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {category.products.map((product) => (
                                        <div key={product.id} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                                            {product.name}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                                        <p className="text-xs text-yellow-700">
                                            This category cannot be deleted because it has associated products. 
                                            Move products to another category first.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="border-t pt-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">Category Information</h3>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Category names must be unique</li>
                                    <li>• Inactive categories won't appear in product creation forms</li>
                                    <li>• Categories with products cannot be deleted</li>
                                </ul>
                            </div>
                        </div>
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
                                    <h3 className="text-lg font-medium text-gray-900">Delete Category</h3>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Are you sure you want to delete this category? This action cannot be undone.
                                </p>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">{category.name}</div>
                                        <div className="text-gray-500">Slug: {category.slug}</div>
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
                                            Delete Category
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