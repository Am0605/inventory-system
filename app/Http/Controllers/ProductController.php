<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with(['category', 'warehouse'])
            ->paginate(10);

        return Inertia::render('inventory/products/index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('is_active', true)->get();
        $warehouses = Warehouse::where('is_active', true)->get();

        return Inertia::render('inventory/products/create', [
            'categories' => $categories,
            'warehouses' => $warehouses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'price' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // Single image
            'is_active' => 'boolean',
        ]);

        // Handle single image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $validated['images'] = [$path]; // Store as array for consistency
        } else {
            $validated['images'] = null;
        }

        // Remove the 'image' field since we're storing it as 'images'
        unset($validated['image']);

        Product::create($validated);

        return redirect()->route('inventory.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $categories = Category::where('is_active', true)->get();
        $warehouses = Warehouse::where('is_active', true)->get();

        return Inertia::render('inventory/products/edit', [
            'product' => $product->load(['category', 'warehouse']),
            'categories' => $categories,
            'warehouses' => $warehouses,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => ['required', 'string', 'max:100', Rule::unique('products')->ignore($product->id)],
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'warehouse_id' => 'required|exists:warehouses,id',
            'price' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'required|integer|min:0',
            'unit' => 'required|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // Single new image
            'remove_image' => 'boolean', // Boolean flag to remove current image
            'is_active' => 'boolean',
        ]);

        // Get current images
        $currentImages = $product->images ?? [];

        // Handle image removal
        if ($validated['remove_image'] && !empty($currentImages)) {
            // Delete current image from storage
            foreach ($currentImages as $image) {
                Storage::disk('public')->delete($image);
            }
            $currentImages = [];
        }

        // Handle new image upload
        if ($request->hasFile('image')) {
            // If there's a current image and we're uploading a new one, delete the old one
            if (!empty($currentImages)) {
                foreach ($currentImages as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
            
            // Store new image
            $path = $request->file('image')->store('products', 'public');
            $currentImages = [$path];
        }

        // Update images in validated data
        $validated['images'] = !empty($currentImages) ? $currentImages : null;

        // Remove fields that are not part of the product model
        unset($validated['image'], $validated['remove_image']);

        $product->update($validated);

        return redirect()->route('inventory.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete associated images
        if ($product->images) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $product->delete();

        return redirect()->route('inventory.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function lowStock(): Response
    {
        $products = Product::with(['category', 'warehouse'])
            ->whereColumn('stock_quantity', '<=', 'min_stock_level')
            ->paginate(10);

        return Inertia::render('inventory/low-stock', [
            'products' => $products,
        ]);
    }
}