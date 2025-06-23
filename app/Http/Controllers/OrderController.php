<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with(['customer', 'supplier'])
            ->latest()
            ->paginate(10);

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    public function create(): Response
    {
        $customers = Customer::where('is_active', true)->get();

        return Inertia::render('orders/create', [
            'customers' => $customers,
        ]);
    }

    public function purchase(): Response
    {
        $orders = Order::with(['supplier'])
            ->where('type', 'purchase')
            ->latest()
            ->paginate(10);

        return Inertia::render('orders/purchase', [
            'orders' => $orders,
        ]);
    }
}