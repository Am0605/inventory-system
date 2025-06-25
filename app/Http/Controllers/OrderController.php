<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

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
        $products = Product::where('is_active', true)->get();

        return Inertia::render('orders/sales/create', [
            'customers' => $customers,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'order_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            // Generate order number
            $orderNumber = 'SO-' . date('Y') . '-' . str_pad(Order::where('type', 'sale')->count() + 1, 4, '0', STR_PAD_LEFT);

            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'type' => 'sale',
                'customer_id' => $validated['customer_id'],
                'order_date' => $validated['order_date'],
                'delivery_date' => $validated['delivery_date'],
                'status' => 'pending',
                'notes' => $validated['notes'],
                'subtotal' => $validated['subtotal'],
                'tax_amount' => $validated['tax_amount'],
                'total' => $validated['total'],
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total' => $item['total'],
                ]);
            }
        });

        return redirect()->route('orders.sales')
            ->with('success', 'Sales order created successfully.');
    }

    public function sales(): Response
    {
        $orders = Order::with(['customer'])
            ->where('type', 'sale')
            ->latest()
            ->paginate(10);

        return Inertia::render('orders/sales/index', [
            'orders' => $orders,
        ]);
    }

    public function purchase(): Response
    {
        $orders = Order::with(['supplier'])
            ->where('type', 'purchase')
            ->latest()
            ->paginate(10);

        return Inertia::render('orders/purchase/index', [
            'orders' => $orders,
        ]);
    }

    public function createPurchase(): Response
    {
        $suppliers = Supplier::where('is_active', true)->get();
        $products = Product::where('is_active', true)->get();

        return Inertia::render('orders/purchase/create', [
            'suppliers' => $suppliers,
            'products' => $products,
        ]);
    }

    public function storePurchase(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'order_date' => 'required|date',
            'delivery_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'subtotal' => 'required|numeric|min:0',
            'tax_amount' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            // Generate order number
            $orderNumber = 'PO-' . date('Y') . '-' . str_pad(Order::where('type', 'purchase')->count() + 1, 4, '0', STR_PAD_LEFT);

            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'type' => 'purchase',
                'supplier_id' => $validated['supplier_id'],
                'order_date' => $validated['order_date'],
                'delivery_date' => $validated['delivery_date'],
                'status' => 'pending',
                'notes' => $validated['notes'],
                'subtotal' => $validated['subtotal'],
                'tax_amount' => $validated['tax_amount'],
                'total' => $validated['total'],
            ]);

            // Create order items
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'total' => $item['total'],
                ]);
            }
        });

        return redirect()->route('orders.purchase')
            ->with('success', 'Purchase order created successfully.');
    }

    public function edit(Order $order): Response
    {
        $order->load(['customer', 'supplier', 'items.product']);
        
        if ($order->type === 'sale') {
            $customers = Customer::where('is_active', true)->get();
            $products = Product::where('is_active', true)->get();
            
            return Inertia::render('orders/sales/edit', [
                'order' => $order,
                'customers' => $customers,
                'products' => $products,
            ]);
        } else {
            $suppliers = Supplier::where('is_active', true)->get();
            $products = Product::where('is_active', true)->get();
            
            return Inertia::render('orders/purchase/edit', [
                'order' => $order,
                'suppliers' => $suppliers,
                'products' => $products,
            ]);
        }
    }

    public function update(Request $request, Order $order)
    {
        if ($order->type === 'sale') {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'order_date' => 'required|date',
                'delivery_date' => 'nullable|date',
                'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
                'notes' => 'nullable|string',
                'subtotal' => 'required|numeric|min:0',
                'tax_amount' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
                'items.*.total' => 'required|numeric|min:0',
            ]);
        } else {
            $validated = $request->validate([
                'supplier_id' => 'required|exists:suppliers,id',
                'order_date' => 'required|date',
                'delivery_date' => 'nullable|date',
                'status' => 'required|in:pending,confirmed,shipped,received,cancelled',
                'notes' => 'nullable|string',
                'subtotal' => 'required|numeric|min:0',
                'tax_amount' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_cost' => 'required|numeric|min:0',
                'items.*.total' => 'required|numeric|min:0',
            ]);
        }

        DB::transaction(function () use ($validated, $order) {
            // Update order
            $orderData = [
                'order_date' => $validated['order_date'],
                'delivery_date' => $validated['delivery_date'],
                'status' => $validated['status'],
                'notes' => $validated['notes'],
                'subtotal' => $validated['subtotal'],
                'tax_amount' => $validated['tax_amount'],
                'total' => $validated['total'],
            ];

            if ($order->type === 'sale') {
                $orderData['customer_id'] = $validated['customer_id'];
            } else {
                $orderData['supplier_id'] = $validated['supplier_id'];
            }

            $order->update($orderData);

            // Delete existing items and create new ones
            $order->items()->delete();

            foreach ($validated['items'] as $item) {
                $itemData = [
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'total' => $item['total'],
                ];

                if ($order->type === 'sale') {
                    $itemData['unit_price'] = $item['unit_price'];
                } else {
                    $itemData['unit_cost'] = $item['unit_cost'];
                }

                OrderItem::create($itemData);
            }
        });

        if ($order->type === 'sale') {
            return redirect()->route('orders.sales')
                ->with('success', 'Sales order updated successfully.');
        } else {
            return redirect()->route('orders.purchase')
                ->with('success', 'Purchase order updated successfully.');
        }
    }

    public function destroy(Order $order)
    {
        $order->items()->delete();
        $order->delete();

        if ($order->type === 'sale') {
            return redirect()->route('orders.sales')
                ->with('success', 'Sales order deleted successfully.');
        } else {
            return redirect()->route('orders.purchase')
                ->with('success', 'Purchase order deleted successfully.');
        }
    }
}