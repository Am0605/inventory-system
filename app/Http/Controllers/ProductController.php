<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category')
            ->paginate(10);

        return Inertia::render('inventory/products/index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('is_active', true)->get();

        return Inertia::render('inventory/products/create', [
            'categories' => $categories,
        ]);
    }

    public function lowStock(): Response
    {
        $products = Product::with('category')
            ->whereColumn('stock_quantity', '<=', 'min_stock_level')
            ->paginate(10);

        return Inertia::render('inventory/low-stock', [
            'products' => $products,
        ]);
    }
}