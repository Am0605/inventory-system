<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Supplier;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_products' => Product::count(),
            'low_stock_products' => Product::whereColumn('stock_quantity', '<=', 'min_stock_level')->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_customers' => Customer::count(),
            'total_suppliers' => Supplier::count(),
        ];

        $recent_orders = Order::with(['customer', 'supplier'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_orders' => $recent_orders,
        ]);
    }
}