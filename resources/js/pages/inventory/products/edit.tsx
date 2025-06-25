import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { PackageSearch, Upload, X, Trash2, AlertTriangle, ImageIcon } from 'lucide-react';
import { FormEventHandler, useState, useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '#' },
    { title: 'Products', href: '/inventory/products' },
    { title: 'Edit Product', href: '' },
];

interface Category {
    id: number;
    name: string;
}

interface Warehouse {
    id: number;
    name: string;
    code: string;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    description: string;
    category: { id: number; name: string };
    warehouse: { id: number; name: string; code: string };
    price: number;
    cost: number;
    stock_quantity: number;
    min_stock_level: number;
    unit: string;
    is_active: boolean;
    images: string[] | null;
}

interface EditProductProps {
    product: Product;
    categories: Category[];
    warehouses: Warehouse[];
}

export default function EditProduct({ product, categories, warehouses }: EditProductProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(
        product.images && product.images.length > 0 ? product.images[0] : null
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        category_id: product.category.id.toString(),
        warehouse_id: product.warehouse.id.toString(),
        price: product.price.toString(),
        cost: product.cost.toString(),
        stock_quantity: product.stock_quantity.toString(),
        min_stock_level: product.min_stock_level.toString(),
        unit: product.unit,
        image: null as File | null,
        remove_image: false as boolean,
        is_active: product.is_active,
        _method: 'PUT' as const,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setData('remove_image', false);
            
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            setCurrentImage(null); // Hide current image when new one is selected
        }
    };

    const removeCurrentImage = () => {
        setCurrentImage(null);
        setData('remove_image', true);
    };

    const removeNewImage = () => {
        setData('image', null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        // Restore current image if it exists and wasn't marked for removal
        if (product.images && product.images.length > 0 && !data.remove_image) {
            setCurrentImage(product.images[0]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post(route('inventory.products.update', product.id), {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('inventory.products.destroy', product.id), {
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

    // Clean up preview URL on unmount
    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Product" />
            
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <PackageSearch className="h-8 w-8 text-blue-600 mr-3" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                            <p className="text-gray-600">Update product information</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Product
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Single Image Management Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Product Image
                            </label>
                            <div className="space-y-4">
                                {/* Current Image Display */}
                                {(currentImage || imagePreview) && (
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <img
                                                src={imagePreview || `/storage/${currentImage}`}
                                                alt="Product"
                                                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-image.png';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={imagePreview ? removeNewImage : removeCurrentImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                            {imagePreview && (
                                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                                        New
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Upload Area - Only show if no image is selected */}
                                {!currentImage && !imagePreview && (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer">
                                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-sm text-gray-600 mb-1">
                                                Click to upload product image
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </label>
                                    </div>
                                )}

                                {/* Replace Image Button */}
                                {(currentImage || imagePreview) && (
                                    <div className="text-center">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="image-replace"
                                        />
                                        <label
                                            htmlFor="image-replace"
                                            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Replace Image
                                        </label>
                                    </div>
                                )}
                            </div>
                            {errors.image && <div className="mt-1 text-sm text-red-600">{errors.image}</div>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SKU <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.sku && <div className="mt-1 text-sm text-red-600">{errors.sku}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="mt-1 text-sm text-red-600">{errors.category_id}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Warehouse <span className="text-red-500">*</span>
                                </label>
                                <select 
                                    value={data.warehouse_id}
                                    onChange={(e) => setData('warehouse_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name} ({warehouse.code})
                                        </option>
                                    ))}
                                </select>
                                {errors.warehouse_id && <div className="mt-1 text-sm text-red-600">{errors.warehouse_id}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (RM) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.price && <div className="mt-1 text-sm text-red-600">{errors.price}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Cost (RM) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.cost}
                                    onChange={(e) => setData('cost', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.cost && <div className="mt-1 text-sm text-red-600">{errors.cost}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.stock_quantity}
                                    onChange={(e) => setData('stock_quantity', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.stock_quantity && <div className="mt-1 text-sm text-red-600">{errors.stock_quantity}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Stock Level
                                </label>
                                <input
                                    type="number"
                                    value={data.min_stock_level}
                                    onChange={(e) => setData('min_stock_level', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.min_stock_level && <div className="mt-1 text-sm text-red-600">{errors.min_stock_level}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.unit && <div className="mt-1 text-sm text-red-600">{errors.unit}</div>}
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
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Updating...' : 'Update Product'}
                            </button>
                        </div>
                    </form>
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
                                    <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 mb-2">
                                    Are you sure you want to delete this product? This action cannot be undone.
                                </p>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900">{product.name}</div>
                                        <div className="text-gray-500">SKU: {product.sku}</div>
                                        <div className="text-gray-500">Stock: {product.stock_quantity} {product.unit}</div>
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
                                            Delete Product
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