<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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

    public function lowStock(): Response
    {
        $products = Product::with(['category', 'warehouse'])
            ->whereColumn('stock_quantity', '<=', 'min_stock_level')
            ->paginate(10);

        return Inertia::render('inventory/low-stock', [
            'products' => $products,
        ]);
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
}