<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function sales(): Response
    {
        $sales_data = Order::where('type', 'sale')
            ->selectRaw('DATE(order_date) as date, SUM(total) as total_sales, COUNT(*) as order_count')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->take(30)
            ->get();

        return Inertia::render('reports/sales', [
            'sales_data' => $sales_data,
        ]);
    }

    public function inventory(): Response
    {
        $inventory_data = Product::with('category')
            ->select('products.*')
            ->selectRaw('(stock_quantity * cost) as stock_value')
            ->get();

        return Inertia::render('reports/inventory', [
            'inventory_data' => $inventory_data,
        ]);
    }

    public function financial(): Response
    {
        $financial_data = [
            'total_sales' => Order::where('type', 'sale')->sum('total'),
            'total_purchases' => Order::where('type', 'purchase')->sum('total'),
            'inventory_value' => Product::selectRaw('SUM(stock_quantity * cost)')->value('SUM(stock_quantity * cost)') ?? 0,
        ];

        return Inertia::render('reports/financial', [
            'financial_data' => $financial_data,
        ]);
    }

    public function stockMovement(): Response
    {
        // This would typically involve a stock movements table
        // For now, we'll show recent orders as stock movements
        $movements = Order::with(['orderItems.product', 'customer', 'supplier'])
            ->latest()
            ->take(50)
            ->get();

        return Inertia::render('reports/stock-movement', [
            'movements' => $movements,
        ]);
    }
}