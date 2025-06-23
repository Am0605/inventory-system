<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();

        $products = [
            [
                'name' => 'Wireless Headphones',
                'sku' => 'WH001',
                'description' => 'High-quality wireless headphones with noise cancellation',
                'price' => 99.99,
                'cost' => 60.00,
                'stock_quantity' => 50,
                'min_stock_level' => 10,
                'unit' => 'pcs',
            ],
            [
                'name' => 'Cotton T-Shirt',
                'sku' => 'TS001',
                'description' => '100% cotton comfortable t-shirt',
                'price' => 19.99,
                'cost' => 8.00,
                'stock_quantity' => 5, // Low stock
                'min_stock_level' => 10,
                'unit' => 'pcs',
            ],
            [
                'name' => 'Programming Book',
                'sku' => 'BK001',
                'description' => 'Learn programming fundamentals',
                'price' => 39.99,
                'cost' => 20.00,
                'stock_quantity' => 25,
                'min_stock_level' => 5,
                'unit' => 'pcs',
            ],
        ];

        foreach ($products as $index => $product) {
            Product::create(array_merge($product, [
                'category_id' => $categories->skip($index % $categories->count())->first()->id,
            ]));
        }
    }
}