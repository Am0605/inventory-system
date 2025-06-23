<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Customer::all();
        $suppliers = Supplier::all();
        $products = Product::all();

        // Create some sale orders
        foreach ($customers->take(2) as $index => $customer) {
            $order = Order::create([
                'order_number' => 'ORD' . str_pad($index + 1, 6, '0', STR_PAD_LEFT),
                'type' => 'sale',
                'customer_id' => $customer->id,
                'status' => 'pending',
                'subtotal' => 0,
                'tax' => 0,
                'total' => 0,
                'order_date' => now()->subDays(rand(1, 30)),
            ]);

            $total = 0;
            foreach ($products->take(2) as $product) {
                $quantity = rand(1, 3);
                $unit_price = $product->price;
                $total_price = $quantity * $unit_price;
                $total += $total_price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unit_price,
                    'total_price' => $total_price,
                ]);
            }

            $order->update([
                'subtotal' => $total,
                'total' => $total,
            ]);
        }

        // Create some purchase orders
        foreach ($suppliers->take(2) as $index => $supplier) {
            $order = Order::create([
                'order_number' => 'PO' . str_pad($index + 1, 6, '0', STR_PAD_LEFT),
                'type' => 'purchase',
                'supplier_id' => $supplier->id,
                'status' => 'pending',
                'subtotal' => 0,
                'tax' => 0,
                'total' => 0,
                'order_date' => now()->subDays(rand(1, 30)),
            ]);

            $total = 0;
            foreach ($products->take(2) as $product) {
                $quantity = rand(10, 50);
                $unit_price = $product->cost;
                $total_price = $quantity * $unit_price;
                $total += $total_price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $unit_price,
                    'total_price' => $total_price,
                ]);
            }

            $order->update([
                'subtotal' => $total,
                'total' => $total,
            ]);
        }
    }
}